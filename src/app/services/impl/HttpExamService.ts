import {ExamService} from '../Services';

import {Observable} from 'rxjs';
import {ExamItem, ExamOverview, Problem} from '../../models';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpExamService extends ExamService {
  baseUrl: string;

  constructor(protected http: HttpClient) {
    super();
    this.baseUrl = environment.academyServiceBaseUrl;
  }

  getExamProgressOverview(studentId: number, examId: number): Observable<ExamOverview> {
    return this.http.get<ExamOverview>(`${this.baseUrl}/api/exams/${examId}/students/${studentId}/overview`);
  }

  getExamsByStudentId(studentId: number, examStatus: ExamStatus = ExamStatus.all,
                      skip: number = 0, size: number = 50): Observable<ExamItem[]> {
    return this.http.get<ExamItem[]>(`${this.baseUrl}/api/students/${studentId}/exams?status=${examStatus}&&skip=${skip}&&size=${size}`);
  }

  getProblem(problemId: number, examId: number): Observable<Problem> {
    return this.http.get(`${this.baseUrl}/api/exams/${examId}/problems/${problemId}`)
      .pipe(map(body => this.toProblem(body)));
  }

  private toProblem(body): Problem {
    return new Problem(body.id, body.title, body.description, body.tags, body.languageEnvs,
      body.testcases);
  }
}


export enum ExamStatus {
  all = 'all', upcoming = 'upcoming', past = 'past', current = 'current'
}
