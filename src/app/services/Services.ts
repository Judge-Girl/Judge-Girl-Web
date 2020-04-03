import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export abstract class LoginService {
  abstract login(studentId: string, password: string): Observable<any>;
}


export class ProblemItem {
  constructor(public id: number,
              public title: string) {
  }
}

@Injectable()
export abstract class ProblemService {
  abstract getProblemItems(page: number): ProblemItem[];
}
