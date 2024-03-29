import {BrokerService, NoSubmissionQuota, ProblemService, SubmissionService, SubmissionThrottlingError} from '../Services';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Answer, CodeFile, Submission, SubmittedCodeSpec} from '../../models';
import {catchError, map, switchMap} from 'rxjs/operators';
import {unzipCodesArrayBuffer} from '../../utils';
import {ActivatedRoute} from '@angular/router';
import {EventBus} from '../EventBus';
import {ExamContext} from '../../contexts/ExamContext';
import {environment} from '../../../environments/environment';
import {StudentContext} from '../../contexts/StudentContext';

// TODO: [improve] duplicate code from HttpSubmissionService
// Currently, we only support 'C' langEnv,
// we should extend this with other languageEnvs in the future
const DEFAULT_LANG_ENV = 'C';

interface AnswerResponse {
  remainingSubmissionQuota: number;
  answer: Answer;
  submission: Submission;
}

export abstract class ExamQuestionSubmissionService extends SubmissionService {
}

@Injectable({
  providedIn: 'root'
})
export class HttpExamQuestionSubmissionService extends ExamQuestionSubmissionService {
  baseUrl: string;
  examId: number;

  constructor(protected http: HttpClient,
              private studentContext: StudentContext,
              private route: ActivatedRoute,
              private eventBus: EventBus,
              private examContext: ExamContext,
              ) {
    super();
    this.baseUrl = environment.academyServiceBaseUrl;
    this.examContext.exam$.subscribe(exam => this.examId = exam.id);
  }

  getSubmissions(problemId: number): Observable<Submission[]> {
    return this.examContext.exam$.pipe(switchMap(exam =>
      this.http.get<Submission[]>(`${this.baseUrl}/api/problems/${problemId}/${DEFAULT_LANG_ENV}` +
        `/students/${this.studentId}/submissions?examId=${exam.id}`)));
  }

  submitFromFile(problemId: number, submittedCodeSpecs: SubmittedCodeSpec[], files: File[]): Observable<Submission> {
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
    return this.http.post<AnswerResponse>(`${this.baseUrl}/api/exams/${this.examId}/problems/${problemId}/${DEFAULT_LANG_ENV}`
      + `/students/${this.studentId}/answers`, formData)
      .pipe(map(response => {
        this.examContext.answerQuestion(response.answer);
        return response.submission;
      }));
  }


  getSubmittedCodes(problemId: number, submissionId: string, submittedCodesFileId: string): Observable<CodeFile[]> {
    return this.http.get(`${this.baseUrl}/api/problems/${problemId}/${DEFAULT_LANG_ENV}/students/` +
      `${this.studentId}/submissions/${submissionId}/submittedCodes/${submittedCodesFileId}`, {
      responseType: 'arraybuffer'
    }).pipe(switchMap(unzipCodesArrayBuffer));
  }

  private get studentId() {
    return this.studentContext.currentStudent.id;
  }

}



