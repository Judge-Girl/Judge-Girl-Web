import {ProblemService, StudentService, SubmissionService} from '../Services';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {JudgeResponse, Submission} from '../../models';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpSubmissionService extends SubmissionService {
  host: string;
  judgeResponse$ = new Subject<JudgeResponse>();

  constructor(private http: HttpClient,
              private studentService: StudentService,
              private problemService: ProblemService,
              @Inject('BASE_URL') baseUrl: string,
              @Inject('PORT_SUBMISSION_SERVICE') port: number) {
    super();
    this.host = `${baseUrl}:${port}`;
  }

  getSubmissions(problemId: number): Observable<Submission[]> {
    this.studentService.authenticate();
    return this.http.get<Submission[]>(
      `${this.host}/api/problems/${problemId}/students/${this.studentService.currentStudent.id}/submissions`, {
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

    return undefined;
  }

}
