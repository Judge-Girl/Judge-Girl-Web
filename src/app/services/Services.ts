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
  currentProblemId: number;
  abstract getProblemItems(page: number): Observable<ProblemItem>;
  abstract getProblem(problemId: number): Observable<Problem>;
}
