import {ExamService} from '../Services';
import {merge, Observable, ReplaySubject, Subject} from 'rxjs';
import {Exam, ExamItem} from '../../models';
import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {shareReplay, switchMap} from 'rxjs/operators';
import {HttpRequestCache} from './HttpRequestCache';

@Injectable({
  providedIn: 'root'
})
export class HttpExamService extends ExamService {
  httpRequestCache: HttpRequestCache;
  host: string;

  constructor(protected http: HttpClient,
              @Inject('BASE_URL') baseUrl: string,
              @Inject('PORT_EXAM_SERVICE') port: number) {
    super();
    this.httpRequestCache = new HttpRequestCache(http);
    this.host = `${baseUrl}:${port}`;
  }

  getExam(examId: number): Observable<Exam> {
    return this.httpRequestCache.get(`${this.host}/api/exams/${examId}`);
  }

  getExamItemsByTag(examTag: string): Observable<ExamItem[]> {
    return this.httpRequestCache.get(`${this.host}/api/exams?tags=${examTag}`);
  }

  getExamItemsInPage(page: number): Observable<ExamItem[]> {
    return this.httpRequestCache.get(`${this.host}/api/exams`);
  }

  getExamTags(): Observable<string[]> {
    return this.httpRequestCache.get(`${this.host}/api/exams/tags`);
  }

}
