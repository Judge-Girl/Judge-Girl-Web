import {ProblemService, StudentService, SubmissionService} from '../Services';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {JudgeResponse, Submission} from '../../models';
import {map, switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpSubmissionService extends SubmissionService {
  host: string;
  judgeResponse$ = new Subject<JudgeResponse>();
  private readonly submissionMap = new Map<number, Array<Submission>>();
  private submissions$ = new Subject<Submission[]>();

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
    this.http.get<Submission[]>(
      `${this.host}/api/problems/${problemId}/students/${this.studentService.currentStudent.id}/submissions`, {
        headers: {
          Authorization: `bearer ${this.studentService.currentStudent.token}`
        }
      }).toPromise()
      .then(submissions => {
        this.submissions$.next(submissions);
        this.submissionMap.set(problemId, submissions);
      });
    return this.submissions$;
  }

  get judgeObservable(): Observable<JudgeResponse> {
    return this.judgeResponse$;
  }

  submitFromFile(problemId: number, files: File[]): Observable<Submission> {
    const formData = new FormData();

    return this.problemService.getProblem(problemId)
      .pipe(switchMap(p => {
        for (let i = 0; i < p.submittedCodeSpecs.length; i++) {
          formData.append('submittedCodes', files[i], p.submittedCodeSpecs[i].fileName);
        }
        return this.http.post<Submission>(`${this.host}/api/problems/${p.id}/students/${this.studentService.currentStudent.id}/submissions`,
          formData, {
            headers: {
              Authorization: `Bearer ${this.studentService.currentStudent.token}`
            }
          });
      })).pipe(map(newSubmission => {
        this.submissionMap.get(problemId).push(newSubmission);
        this.submissions$.next(this.submissionMap.get(problemId));
        return newSubmission;
      }));
  }

}
