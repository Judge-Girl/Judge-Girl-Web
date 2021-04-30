import {ExamService} from '../Services';

import {merge, Observable, ReplaySubject, Subject} from 'rxjs';
import {ExamOverview, ExamItem} from '../../models';
import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {HttpRequestCache} from './HttpRequestCache';

@Injectable({
  providedIn: 'root'
})
export class HttpExamService extends ExamService {
  httpRequestCache: HttpRequestCache;
  baseUrl: string;

  constructor(protected http: HttpClient,
              @Inject('EXAM_SERVICE_BASE_URL') baseUrl: string) {
    super();
    this.httpRequestCache = new HttpRequestCache(http);
    this.baseUrl = baseUrl;
  }

  getExamProgressOverview(studentId: number, examId: number, cached: boolean = true): Observable<ExamOverview> {
    if (cached) {
      return this.httpRequestCache.get(`${this.baseUrl}/api/exams/${examId}/students/${studentId}/overview`);
    } else {
      return this.http.get<ExamOverview>(`${this.baseUrl}/api/exams/${examId}/students/${studentId}/overview`);
    }
  }

  getExamsByStudentId(studentId: number, examStatus: ExamStatus = ExamStatus.all,
                      skip: number = 0, size: number = 50): Observable<ExamItem[]> {
    return this.httpRequestCache.get(`${this.baseUrl}/api/students/${studentId}/exams?status=${examStatus}&&skip=${skip}&&size=${size}`);
  }
}


export enum ExamStatus {
  all = 'all', upcoming = 'upcoming', past = 'past', current = 'current'
}
