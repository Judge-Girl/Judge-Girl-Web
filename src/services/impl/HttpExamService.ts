import {ExamService, StudentService} from '../Services';

import {Observable} from 'rxjs';
import {ExamItem, ExamOverview} from '../../app/models';
import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

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
}


export enum ExamStatus {
  all = 'all', upcoming = 'upcoming', past = 'past', current = 'current'
}
