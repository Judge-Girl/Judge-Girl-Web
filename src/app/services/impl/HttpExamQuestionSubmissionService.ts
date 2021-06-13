import {
  BrokerMessage,
  BrokerService,
  NoSubmissionQuota,
  ProblemService,
  StudentService,
  SubmissionService,
  SubmissionThrottlingError,
  Unsubscribe
} from '../Services';
import {Observable, of, ReplaySubject, Subject, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Answer, CodeFile, Problem, Submission, VerdictIssuedEvent} from '../../models';
import {catchError, switchMap} from 'rxjs/operators';
import {unzipCodesArrayBuffer} from '../../utils';
import {HttpRequestCache} from './HttpRequestCache';
import {ActivatedRoute} from '@angular/router';
import {EventBus} from '../EventBus';

// TODO: [improve] duplicate code from HttpSubmissionService
// Currently, we only support 'C' langEnv,
// we should extend this with other languageEnvs in the future
const DEFAULT_LANG_ENV = 'C';

interface AnswerResponse {
  remainingSubmissionQuota: number;
  answer: Answer;
  submission: Submission;
}

const SUBSCRIBER_NAME = 'ExamQuestSubmissionService: Subscribe-To-Verdict';

@Injectable({
  providedIn: 'root'
})
export class HttpExamQuestionSubmissionService extends SubmissionService {
  httpRequestCache: HttpRequestCache;
  baseUrl: string;
  latestQueryProblemId: number;
  currentSubmissions: Submission[] = [];
  currentSubmissions$ = new ReplaySubject<Submission[]>(1);
  verdictIssuedEvent$ = new Subject<VerdictIssuedEvent>();
  unsubscribes: Unsubscribe[] = [];

  examId: number;

  constructor(protected http: HttpClient,
              private studentService: StudentService,
              private problemService: ProblemService,
              private brokerService: BrokerService,
              private route: ActivatedRoute,
              private eventBus: EventBus,
              @Inject('EXAM_SERVICE_BASE_URL') baseUrl: string) {
    super();
    this.httpRequestCache = new HttpRequestCache(http);
    this.baseUrl = baseUrl;
    // Currently we can not find any method to get the route param from the url path.
    // The following line use regex to parse `examId` (the number after `exams/`).
    this.examId = Number(/\/exams\/(?<examId>\d*)\//.exec(window.location.href).groups.examId);
  }

  public onInit() {
    const subscription = this.studentService.currentStudent$.subscribe(student => {
      this.unsubscribes.push(
        this.brokerService.subscribe(SUBSCRIBER_NAME,
          `/students/${student.id}/verdicts`, message => this.handleVerdictFromBrokerMessage(message)));
    });
    this.unsubscribes.push(() => subscription.unsubscribe());
  }

  public onDestroy() {
    for (const unsubscribe of this.unsubscribes) {
      unsubscribe();
    }
  }

  private handleVerdictFromBrokerMessage(message: BrokerMessage) {
    const obj = JSON.parse(message.body);
    const event = new VerdictIssuedEvent(obj.problemId, obj.studentId, obj.problemTitle, obj.submissionId, obj.verdict);
    this.verdictIssuedEvent$.next(event);
    this.updateVerdictInTheSubmission(event);
  }

  private updateVerdictInTheSubmission(event: VerdictIssuedEvent) {
    this.eventBus.publish(event);
    this.currentSubmissions
      .filter(submission => submission.id === event.submissionId)
      .forEach(submission => {
        submission.verdict = event.verdict;
        submission.judged = true;
      });
    this.currentSubmissions$.next(this.currentSubmissions);
  }

  getSubmissions(problemId: number): Observable<Submission[]> {
    if (this.latestQueryProblemId !== problemId) {
      // refresh the subject for different problem's submissions
      this.currentSubmissions$ = new ReplaySubject<Submission[]>(1);
    }
    this.latestQueryProblemId = problemId;
    this.studentService.authenticate();
    const url = `${this.baseUrl}/api/problems/${problemId}/${DEFAULT_LANG_ENV}` +
      `/students/${this.studentId}/submissions?examId=${this.examId}`;
    this.http.get<Submission[]>(url, this.httpOptions)
      .toPromise()
      .then(submissions => {
        this.currentSubmissions = submissions;
        this.currentSubmissions$.next(submissions);
      });

    return this.currentSubmissions$;
  }

  submitFromFile(problemId: number, files: File[]): Observable<Submission> {
    this.studentService.authenticate();
    const formData = new FormData();
    return this.problemService.getProblem(problemId)
      .pipe(switchMap(p => this.requestSubmitCodes(p, formData, files)))
      .pipe(catchError((err: HttpErrorResponse) => {
        const error = err.error.error;
        if ('no-submission-quota' === error) {  // 400 --> throttling problem (currently the only case)
          return throwError(new NoSubmissionQuota());
        } else if ('submission-throttling' === error) {
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
    return this.http.post<AnswerResponse>(url, formData, this.httpOptions)
      .pipe(switchMap(response => {
        this.remainingSubmissionQuota = response.remainingSubmissionQuota;
        this.pushSubmissionIfNotDuplicate(response.submission);
        this.currentSubmissions$.next(this.currentSubmissions);
        return of(response.submission);
      }));
  }


  private pushSubmissionIfNotDuplicate(submission: Submission) {
    for (const s of this.currentSubmissions) {
      if (s.id === submission.id) {
        return;
      }
    }
    this.currentSubmissions.push(submission);
  }

  getSubmittedCodes(problemId: number, submissionId: string, submittedCodesFileId: string): Observable<CodeFile[]> {
    return this.problemService.getProblem(problemId)
      .pipe(switchMap(() => {
        const url = `${this.baseUrl}/api/problems/${problemId}/${DEFAULT_LANG_ENV}/students/` +
          `${this.studentId}/submissions/${submissionId}/submittedCodes/${submittedCodesFileId}`;
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

  private get studentId() {
    return this.studentService.currentStudent.id;
  }

}



