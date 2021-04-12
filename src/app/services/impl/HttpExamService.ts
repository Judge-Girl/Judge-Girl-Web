import {ExamService} from '../Services';
import { Observable } from 'rxjs';
import {Exam, ExamItem} from '../../models';
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

  getExamOverview(examId: number): Observable<Exam> {
    return this.httpRequestCache.get(`${this.baseUrl}/api/exams/${examId}/overview`);
  }

  getExamsByStudentId(studentId: number, examStatus: ExamStatus = ExamStatus.all,
                      skip: number = 0, size: number = 50): Observable<ExamItem[]> {
    return this.httpRequestCache.get(`${this.baseUrl}/api/students/${studentId}/exams?status=${examStatus}&&skip=${skip}&&size=${size}`);
  }
}


export enum ExamStatus {
  all = 'all', upcoming = 'upcoming', past = 'past', current = 'current'
}
