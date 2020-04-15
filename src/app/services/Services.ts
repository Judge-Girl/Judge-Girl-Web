import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Problem, ProblemItem} from '../models';

@Injectable()
export abstract class LoginService {
  hasLogin = false;

  abstract login(studentId: string, password: string): Observable<any>;
}

@Injectable()
export abstract class ProblemService {
  protected _currentProblemId: number;

  abstract getCurrentProblem(): Observable<Problem>;

  abstract getProblemTags(): Observable<string>;

  abstract getProblemItemsByTag(problemTag: string): Observable<ProblemItem>;

  abstract getProblemItemsInPage(page: number): Observable<ProblemItem>;

  abstract getProblem(problemId: number): Observable<Problem>;
}
