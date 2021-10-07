import {BrokerService, NoSubmissionQuota, ProblemService, StudentService, SubmissionService, SubmissionThrottlingError} from '../Services';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {CodeFile, Submission, SubmittedCodeSpec} from '../../app/models';
import {catchError, switchMap} from 'rxjs/operators';
import {unzipCodesArrayBuffer} from '../../app/utils';
import {EventBus} from '../EventBus';

// Currently, we only support 'C' langEnv,
// we should extend this with other languageEnvs in the future
const DEFAULT_LANG_ENV = 'C';

@Injectable({
  providedIn: 'root'
})
export class HttpSubmissionService extends SubmissionService {

  constructor(protected http: HttpClient,
              private studentService: StudentService,
              private problemService: ProblemService,
              private brokerService: BrokerService,
              private eventBus: EventBus,
              @Inject('SUBMISSION_SERVICE_BASE_URL') private baseUrl: string) {
    super();
  }

  getSubmissions(problemId: number): Observable<Submission[]> {
    return this.http.get<Submission[]>(
      `${this.baseUrl}/api/problems/${problemId}/${DEFAULT_LANG_ENV}` +
      `/students/${this.studentId}/submissions`);
  }

  submitFromFile(problemId: number, submittedCodeSpecs: SubmittedCodeSpec[],
                 files: File[]): Observable<Submission> {
    const formData = new FormData();
    return this.requestSubmitCodes(problemId, submittedCodeSpecs, formData, files)
      .pipe(catchError((err: HttpErrorResponse) => {
        const error = err.error.error;
        if ('no-submission-quota' === error) {
          return throwError(new NoSubmissionQuota());
        } else if ('submission-throttling' === error) {
          return throwError(new SubmissionThrottlingError());
        } else {
          return throwError(err);
        }
      }));
  }

  private requestSubmitCodes(problemId: number, submittedCodeSpecs: SubmittedCodeSpec[],
                             formData: FormData, files: File[]): Observable<Submission> {
    for (let i = 0; i < submittedCodeSpecs.length; i++) {
      formData.append('submittedCodes', files[i], submittedCodeSpecs[i].fileName);
    }
    return this.http.post<Submission>(`${this.baseUrl}/api/problems/${problemId}/${DEFAULT_LANG_ENV}/students/` +
      `${this.studentId}/submissions`, formData);
  }

  getSubmittedCodes(problemId: number, submissionId: string, submittedCodesFileId: string): Observable<CodeFile[]> {
    return this.problemService.getProblem(problemId)
      .pipe(switchMap(() => {
        return this.http.get(`${this.baseUrl}/api/problems/${problemId}/${DEFAULT_LANG_ENV}` +
          `/students/${this.studentId}/submissions/${submissionId}/submittedCodes/${submittedCodesFileId}`, {
          responseType: 'arraybuffer'
        });
      }))
      .pipe(switchMap(unzipCodesArrayBuffer));
  }

  private get studentId() {
    return this.studentService.currentStudent.id;
  }
}

