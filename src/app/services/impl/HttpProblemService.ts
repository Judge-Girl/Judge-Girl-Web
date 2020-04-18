import {ProblemService} from '../Services';
import {Observable} from 'rxjs';
import {Problem, ProblemItem, TestCase} from '../../models';
import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpProblemService extends ProblemService {
  host: string;

  constructor(private http: HttpClient,
              @Inject('BASE_URL') baseUrl: string,
              @Inject('PORT_PROBLEM_SERVICE') port: number) {
    super();
    this.host = `${baseUrl}:${port}`;
  }

  getProblem(problemId: number): Observable<Problem> {
    return this.http.get<Problem>(`${this.host}/api/problems/${problemId}`);
  }

  getProblemItemsByTag(problemTag: string): Observable<ProblemItem[]> {
    return this.http.get<ProblemItem[]>(`${this.host}/api/problems?tag=${problemTag}`);
  }

  getProblemItemsInPage(page: number): Observable<ProblemItem[]> {
    return this.http.get<ProblemItem[]>(`${this.host}/api/problems`);
  }

  getProblemTags(): Observable<string[]> {
    return this.http.get<string[]>(`${this.host}/api/problems/tags`);
  }

  getTestCases(problemId: number): Observable<TestCase[]> {
    return this.http.get<TestCase[]>(`${this.host}/api/problems/${problemId}/testcases`);
  }

}
