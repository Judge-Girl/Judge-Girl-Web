import {ProblemService} from '../Services';
import {merge, Observable, ReplaySubject, Subject} from 'rxjs';
import {Problem, ProblemItem, TestCase} from '../../models';
import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {shareReplay, switchMap} from 'rxjs/operators';
import {HttpRequestCache} from './HttpRequestCache';

@Injectable({
  providedIn: 'root'
})
export class HttpProblemService extends ProblemService {
  httpRequestCache: HttpRequestCache;
  host: string;

  constructor(protected http: HttpClient,
              @Inject('BASE_URL') baseUrl: string,
              @Inject('PORT_PROBLEM_SERVICE') port: number) {
    super();
    this.httpRequestCache = new HttpRequestCache(http);
    this.host = `${baseUrl}:${port}`;
  }

  getProblem(problemId: number): Observable<Problem> {
    return this.httpRequestCache.get(`${this.host}/api/problems/${problemId}`);
  }

  getProblemItemsByTag(problemTag: string): Observable<ProblemItem[]> {
    return this.httpRequestCache.get(`${this.host}/api/problems?tag=${problemTag}`);
  }

  getProblemItemsInPage(page: number): Observable<ProblemItem[]> {
    return this.httpRequestCache.get(`${this.host}/api/problems`);
  }

  getProblemTags(): Observable<string[]> {
    return this.httpRequestCache.get(`${this.host}/api/problems/tags`);
  }

  getTestCases(problemId: number): Observable<TestCase[]> {
    return this.httpRequestCache.get(`${this.host}/api/problems/${problemId}/testcases`);
  }

}
