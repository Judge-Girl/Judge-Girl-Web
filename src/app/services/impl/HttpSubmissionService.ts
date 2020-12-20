import {ProblemService, StudentService, SubmissionService, SubmissionThrottlingError} from '../Services';
import {Observable, Subject, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {CodeFile, VerdictIssuedEvent, Problem, Submission} from '../../models';
import {catchError, map, switchMap} from 'rxjs/operators';
import {unzipCodesArrayBuffer} from '../../utils';
import {HttpRequestCache} from './HttpRequestCache';


/**
 * TODO (1) Currently, this service use polling trick to listen to the judge responses, which should be removed in the future version.
 */
@Injectable({
  providedIn: 'root'
})
export class HttpSubmissionService extends SubmissionService {
  httpRequestCache: HttpRequestCache;
  host: string;
  verdictIssuedEvent$ = new Subject<VerdictIssuedEvent>();
  private readonly submissionMap = new Map<number, Array<Submission>>();
  private submissions$ = new Subject<Submission[]>();

  // TODO (to remove) polling trick
  // store a set of pollingItem's stringified representation <problemId:problemTitle-studentId-submissionId>
  // this set is used for avoid duplicate pollings
  private readonly pollingSets = new Set<string>();

  constructor(protected http: HttpClient,
              private studentService: StudentService,
              private problemService: ProblemService,
              @Inject('BASE_URL') baseUrl: string,
              @Inject('PORT_SUBMISSION_SERVICE') port: number) {
    super();
    this.httpRequestCache = new HttpRequestCache(http);
    this.host = `${baseUrl}:${port}`;
  }

  getSubmissions(problemId: number): Observable<Submission[]> {
    this.studentService.authenticate();
    this.http.get<Submission[]>(
      `${this.host}/api/problems/${problemId}/students/${this.studentService.currentStudent.id}/submissions`, {
        headers: {
          Authorization: `bearer ${this.studentService.currentStudent.token}`
        }
      }).toPromise()
      .then(submissions => {
        this.submissions$.next(submissions);
        this.submissionMap.set(problemId, submissions);

        // TODO (to remove) Polling Tricks
        this.problemService.getProblem(problemId).toPromise()
          .then(p => {
            // for every non-judged submission, register it for polling
            for (const submission of submissions) {
              if (!submission.isJudged) {
                this.pollForSubmission(problemId, p.title, this.studentService.currentStudent.id, submission.id);
              }
            }
          });
      });
    return this.submissions$;
  }

  getSubmission(problemId: number, submissionId: string): Observable<Submission> {
    this.studentService.authenticate();
    return this.http.get<Submission>(
      `${this.host}/api/problems/${problemId}/students/${this.studentService.currentStudent.id}/submissions/${submissionId}`, {
        headers: {
          Authorization: `bearer ${this.studentService.currentStudent.token}`
        }
      });
  }

  get verdictIssuedEventObservable(): Observable<VerdictIssuedEvent> {
    return this.verdictIssuedEvent$;
  }

  submitFromFile(problemId: number, files: File[]): Observable<Submission> {
    this.studentService.authenticate();
    const formData = new FormData();
    let problem: Problem;
    return this.problemService.getProblem(problemId)
      .pipe(switchMap(p => {
        problem = p;
        return this.requestSubmitCodes(p, formData, files, problemId);
      })).pipe(catchError((err: HttpErrorResponse) => {
        if (err.status === 400) {  // 400 --> throttling problem
          return throwError(new SubmissionThrottlingError(err.error.message));
        } else {
          return throwError(err);
        }
      })).pipe(map(newSubmission => {
        this.pollForSubmission(problemId, problem.title, this.studentService.currentStudent.id, newSubmission.id);
        this.addOrReplaceSubmission(problemId, newSubmission);
        this.submissions$.next(this.submissionMap.get(problemId));
        return newSubmission;
      }));
  }

  private requestSubmitCodes(p: Problem, formData: FormData, files: File[], problemId: number) {
    for (let i = 0; i < p.submittedCodeSpecs.length; i++) {
      formData.append('submittedCodes', files[i], p.submittedCodeSpecs[i].fileName);
    }
    return this.http.post<Submission>(`${this.host}/api/problems/${problemId}/students/` +
      `${this.studentService.currentStudent.id}/submissions`,
      formData, {
        headers: {
          Authorization: `Bearer ${this.studentService.currentStudent.token}`
        }
      });
  }

// TODO (to remove) Polling Tricks
  private pollForSubmission(problemId: number, problemTitle: string, studentId: number, submissionId: string) {
    const pollingItemHash = this.stringifyPollingItem(problemId, problemTitle, studentId, submissionId);
    if (!this.pollingSets.has(pollingItemHash)) {
      this.pollingSets.add(pollingItemHash);
      this.pollEveryInterval(studentId, submissionId, problemId, problemTitle, pollingItemHash);
    }
  }

  private pollEveryInterval(studentId: number, submissionId: string, problemId: number, problemTitle: string, pollingItemStr: string) {
    const id = setInterval(async () => {
      // make sure it's polling for the same student, otherwise cancel it
      if (studentId === this.studentService.currentStudent.id) {
        console.log(`Polling for submission ${submissionId}`);
        const submission = await this.getSubmission(problemId, submissionId).toPromise();
        if (submission.isJudged) {
          console.log(`Submission ${submissionId} judged.`);
          this.addOrReplaceSubmission(problemId, submission);
          this.verdictIssuedEvent$.next(
            new VerdictIssuedEvent(problemId, problemTitle, submission.id, submission.verdict));
          this.pollingSets.delete(pollingItemStr);
          clearInterval(id);
        }
      } else {
        this.pollingSets.delete(pollingItemStr);
        clearInterval(id);
      }
    }, 8000);
  }

  private stringifyPollingItem(problemId: number, problemTitle: string, studentId: number, submissionId: string): string {
    return `${problemId}:${problemTitle}-${studentId}-${submissionId}`;
  }

  getSubmittedCodes(problemId: number, submissionId: string, submittedCodesFileId: string): Observable<CodeFile[]> {
    return this.problemService.getProblem(problemId)
      .pipe(switchMap(p => {
        return this.http.get(`${this.host}/api/problems/${problemId}/students/${this.studentService.currentStudent.id}` +
          `/submissions/${submissionId}/submittedCodes/${submittedCodesFileId}`, {
          headers: {
            'Content-Type': 'application/zip',
            Authorization: `Bearer ${this.studentService.currentStudent.token}`
          },
          responseType: 'arraybuffer'
        });
      }))
      .pipe(switchMap(unzipCodesArrayBuffer));
  }

  private addOrReplaceSubmission(problemId: number, submission: Submission) {
    const submissions = this.submissionMap.get(problemId);
    if (submissions) {
      for (const sub of submissions) {
        if (sub.id === submission.id) {
          // replace it
          submissions.splice(submissions.indexOf(sub), 1, submission);
          return;
        }
      }
    }
    submissions.push(submission); // otherwise push it
  }
}

