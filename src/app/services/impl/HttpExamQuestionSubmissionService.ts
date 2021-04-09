import { BrokerMessage, BrokerService, ProblemService, StudentService, SubmissionService, SubmissionThrottlingError } from '../Services';
import { Observable, of, ReplaySubject, Subject, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CodeFile, Problem, Student, Submission, VerdictIssuedEvent } from '../../models';
import { catchError, switchMap } from 'rxjs/operators';
import { unzipCodesArrayBuffer } from '../../utils';
import { HttpRequestCache } from './HttpRequestCache';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';

// Currently, we only support 'C' langEnv,
// we should extend this with other languageEnvs in the future
const DEFAULT_LANG_ENV = 'C';

@Injectable({
  providedIn: 'root'
})
export class HttpExamQuestionSubmissionService extends SubmissionService {
  httpRequestCache: HttpRequestCache;
  baseUrl: string;
  currentSubmissions: Submission[] = [];
  currentSubmissions$ = new ReplaySubject<Submission[]>(1);
  verdictIssuedEvent$ = new Subject<VerdictIssuedEvent>();

  examId: number;

  constructor(protected http: HttpClient,
              private studentService: StudentService,
              private problemService: ProblemService,
              private brokerService: BrokerService,
              private route: ActivatedRoute,
              @Inject('EXAM_SERVICE_BASE_URL') baseUrl: string) {
    super();
    this.httpRequestCache = new HttpRequestCache(http);
    this.baseUrl = baseUrl;
    this.examId = 1; // TODO
    this.studentService.currentStudentObservable
      .subscribe(student => this.subscribeToVerdicts(student));
  }

  private subscribeToVerdicts(student: Student) {
    this.brokerService.subscribe(`/students/${student.id}/verdicts`,
      message => this.handleVerdictFromBrokerMessage(message));
  }

  private handleVerdictFromBrokerMessage(message: BrokerMessage) {
    const obj = JSON.parse(message.body);
    const event = new VerdictIssuedEvent(obj.problemId, obj.studentId, obj.problemTitle, obj.submissionId, obj.verdict);
    this.verdictIssuedEvent$.next(event);
    this.updateVerdictInTheSubmission(event);
  }

  private updateVerdictInTheSubmission(event: VerdictIssuedEvent) {
    this.currentSubmissions
      .filter(submission => submission.id === event.submissionId)
      .forEach(submission => {
        submission.verdict = event.verdict;
        submission.isJudged = true;
      });
    this.currentSubmissions$.next(this.currentSubmissions);
  }

  getSubmissions(problemId: number): Observable<Submission[]> {
    this.currentSubmissions$.next([]); // clear previous submissions
    this.studentService.authenticate();
    const url = `${this.baseUrl}/api/problems/${problemId}/${DEFAULT_LANG_ENV}/students/${this.studentId}/submissions`;
    this.http.get<Submission[]>(url, this.httpOptions)
      .toPromise()
      .then(submissions => {
        this.currentSubmissions = submissions;
        this.currentSubmissions$.next(submissions);
      });

    return this.currentSubmissions$;
  }

  getSubmission(problemId: number, submissionId: string): Observable<Submission> {
    this.studentService.authenticate();
    const url = `${this.baseUrl}/api/exams/${this.examId}/problems/${problemId}/${DEFAULT_LANG_ENV}/students/${this.studentId}/submissions/${submissionId}`;
    return this.http.get<Submission>(url, this.httpOptions);
  }

  submitFromFile(problemId: number, files: File[]): Observable<Submission> {
    this.studentService.authenticate();
    const formData = new FormData();
    return this.problemService.getProblem(problemId)
      .pipe(switchMap(p => {
        return this.requestSubmitCodes(p, formData, files);
      })).pipe(catchError((err: HttpErrorResponse) => {
        if (err.status === 400) {  // 400 --> throttling problem (currently the only case)
          return throwError(new SubmissionThrottlingError());
        } else {
          return throwError(err);
        }
      }));
  }

  private requestSubmitCodes(problem: Problem, formData: FormData, files: File[]): Observable<Submission> {
    for (let i = 0; i < problem.submittedCodeSpecs.length; i++) {
      formData.append('submittedCodes', files[i], problem.submittedCodeSpecs[i].fileName);
    }
    const url = `${this.baseUrl}/api/exams/${this.examId}/problems/${problem.id}/${DEFAULT_LANG_ENV}/students/${this.studentId}/answers`;
    return this.http.post<Submission>(url, formData, this.httpOptions)
      .pipe(switchMap(submission => {
        this.currentSubmissions.push(submission);
        this.currentSubmissions$.next(this.currentSubmissions);
        return of(submission);
      }));
  }

  getSubmittedCodes(problemId: number, submissionId: string, submittedCodesFileId: string): Observable<CodeFile[]> {
    return this.problemService.getProblem(problemId)
      .pipe(switchMap(p => {
        const url = `${this.baseUrl}/api/exams/${this.examId}/problems/${problemId}/${DEFAULT_LANG_ENV}/students/${this.studentId}/submissions/${submissionId}/submittedCodes/${submittedCodesFileId}`
        return this.http.get(url, {
          headers: this.httpHeaders,
          responseType: 'arraybuffer'
        });
      }))
      .pipe(switchMap(unzipCodesArrayBuffer));
  }


  // TODO: potentially duplicate code, currently no idea how to extract it.
  private get httpOptions(): { headers: HttpHeaders } {
    return {
      headers: this.httpHeaders
    };
  }

  private get httpHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.studentService.currentStudent.token}`
    });
  }

  get verdictIssuedEventObservable(): Observable<VerdictIssuedEvent> {
    return this.verdictIssuedEvent$;
  }

  private get studentId() {
    return this.studentService.currentStudent.id;
  }
}

