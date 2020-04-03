import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ProblemItem} from '../models/Problems';

@Injectable()
export abstract class LoginService {
  abstract login(studentId: string, password: string): Observable<any>;
}


@Injectable()
export abstract class ProblemService {
  abstract getProblemItems(page: number): Observable<ProblemItem>;
}
