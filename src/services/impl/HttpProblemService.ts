import {ProblemService} from '../Services';
import {Observable} from 'rxjs';
import {Problem, ProblemItem} from '../../app/models';
import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {HttpRequestCache} from './HttpRequestCache';

@Injectable({
  providedIn: 'root'
})
export class HttpProblemService extends ProblemService {
  httpRequestCache: HttpRequestCache;
  baseUrl: string;

  constructor(protected http: HttpClient,
              @Inject('PROBLEM_SERVICE_BASE_URL') baseUrl: string) {
    super();
    this.httpRequestCache = new HttpRequestCache(http);
    this.baseUrl = baseUrl;
  }

  getProblem(problemId: number): Observable<Problem> {
    return this.httpRequestCache.get(`${this.baseUrl}/api/problems/${problemId}`)
      .pipe(map(body => this.toProblem(body)));
  }

  getProblemItemsByTag(problemTag: string): Observable<ProblemItem[]> {
    return this.httpRequestCache.get(`${this.baseUrl}/api/problems?tags=${problemTag}`);
  }

  getProblemItemsInPage(page: number): Observable<ProblemItem[]> {
    return this.httpRequestCache.get(`${this.baseUrl}/api/problems`);
  }

  getProblemTags(): Observable<string[]> {
    return this.httpRequestCache.get(`${this.baseUrl}/api/problems/tags`);
  }

  toProblem(body): Problem {
    return new Problem(body.id, body.title, body.description, body.tags, body.languageEnvs,
      body.testcases);
  }

}
