import {ExamService} from '../Services';
import {merge, Observable, ReplaySubject, Subject} from 'rxjs';
import {ExamItem} from '../../models';
import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {shareReplay, switchMap} from 'rxjs/operators';
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

  getExam(examId: number): Observable<ExamItem> {
    return this.httpRequestCache.get(`${this.baseUrl}/api/exams/${examId}`);
  }

  getExamsByStudentId(studentId: number, examType?: string): Observable<ExamItem[]> {
    return this.httpRequestCache.get(`${this.baseUrl}/api/students/${studentId}/exams?type=${examType}`);
  }
}
