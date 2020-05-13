import {ProblemService, StudentService, SubmissionService} from '../Services';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {CodeFile, JudgeResponse, Problem, Submission} from '../../models';
import {map, switchMap} from 'rxjs/operators';
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
  judgeResponse$ = new Subject<JudgeResponse>();
  private readonly submissionMap = new Map<number, Array<Submission>>();
  private submissions$ = new Subject<Submission[]>();

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
            for (const submission of submissions) {
              if (!submission.judges || !submission.judgeTime) {
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

  get judgeObservable(): Observable<JudgeResponse> {
    return this.judgeResponse$;
  }

  submitFromFile(problemId: number, files: File[]): Observable<Submission> {
    const formData = new FormData();
    let problem: Problem;
    return this.problemService.getProblem(problemId)
      .pipe(switchMap(p => {
        problem = p;
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
      })).pipe(map(newSubmission => {
        this.pollForSubmission(problemId, problem.title, this.studentService.currentStudent.id, newSubmission.id);
        this.submissionMap.get(problemId).push(newSubmission);
        this.submissions$.next(this.submissionMap.get(problemId));
        return newSubmission;
      }));
  }

  // TODO (to remove) Polling Tricks
  private pollForSubmission(problemId: number, problemTitle: string, studentId: number, submissionId: string) {
    const id = setInterval(() => {
      if (studentId === this.studentService.currentStudent.id) {
        console.log(`Poll for submission ${submissionId}`);
        this.getSubmission(problemId, submissionId).toPromise()
          .then(submission => {
            if (submission.judges && submission.judgeTime) {
              console.log(`Submission ${submissionId} judged.`);
              for (const sub of this.submissionMap.get(problemId)) {
                if (submission.id === sub.id) {
                  const array = this.submissionMap.get(problemId);
                  array.splice(array.indexOf(sub), 1, submission);
                }
              }
              this.judgeResponse$.next(new JudgeResponse(problemId, problemTitle, submission));
              clearInterval(id);
            }
          });
      }
    }, 8000);
  }

  getSubmittedCodes(problemId: number, submissionId: string): Observable<CodeFile[]> {
    return this.problemService.getProblem(problemId)
      .pipe(switchMap(p => {
        return this.http.get(`${this.host}/api/problems/${problemId}/students/${this.studentService.currentStudent.id}` +
          `/submissions/${submissionId}/zippedSubmittedCodes`, {
          headers: {
            'Content-Type': 'application/zip',
            Authorization: `Bearer ${this.studentService.currentStudent.token}`
          },
          responseType: 'arraybuffer'
        });
      }))
      .pipe(switchMap(unzipCodesArrayBuffer));
  }

}
