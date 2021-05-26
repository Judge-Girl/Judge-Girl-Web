import {ExamService, StudentService} from '../Services';

import {Observable} from 'rxjs';
import {ExamItem, ExamOverview} from '../../models';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {HttpRequestCache} from './HttpRequestCache';

@Injectable({
  providedIn: 'root'
})
export class HttpExamService extends ExamService {
  httpRequestCache: HttpRequestCache;
  baseUrl: string;

  constructor(protected http: HttpClient,
              private studentService: StudentService,
              @Inject('EXAM_SERVICE_BASE_URL') baseUrl: string) {
    super();
    this.httpRequestCache = new HttpRequestCache(http);
    this.baseUrl = baseUrl;
  }

  getExamProgressOverview(studentId: number, examId: number): Observable<ExamOverview> {
    return this.http.get<ExamOverview>(`${this.baseUrl}/api/exams/${examId}/students/${studentId}/overview`,
      this.httpOptions);
  }

  getExamsByStudentId(studentId: number, examStatus: ExamStatus = ExamStatus.all,
                      skip: number = 0, size: number = 50): Observable<ExamItem[]> {
    return this.httpRequestCache.get(`${this.baseUrl}/api/students/${studentId}/exams?status=${examStatus}&&skip=${skip}&&size=${size}`,
      this.httpHeaders);
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
}


export enum ExamStatus {
  all = 'all', upcoming = 'upcoming', past = 'past', current = 'current'
}
