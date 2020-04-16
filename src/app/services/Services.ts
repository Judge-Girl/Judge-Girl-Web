import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Problem, ProblemItem, TestCase} from '../models';

@Injectable()
export abstract class LoginService {
  hasLogin = false;

  abstract login(studentId: string, password: string): Observable<any>;
}

@Injectable()
export abstract class ProblemService {

  abstract getProblemTags(): Observable<string>;

  abstract getProblemItemsByTag(problemTag: string): Observable<ProblemItem>;

  abstract getProblemItemsInPage(page: number): Observable<ProblemItem>;

  abstract getProblem(problemId: number): Observable<Problem>;

  abstract getTestCases(problemId: number): Observable<TestCase[]>;
}
