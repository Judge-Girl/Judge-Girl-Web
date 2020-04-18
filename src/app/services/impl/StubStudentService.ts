import {StudentService} from '../Services';
import {Observable, Subject} from 'rxjs';
import {Student} from '../../models';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';

export class StubStudentService extends StudentService {

  constructor(router: Router, cookieService: CookieService) {
    super(router, cookieService);
  }

  login(account: string, password: string): Observable<Student> {
    const loginSubject = new Subject<Student>();
    setTimeout(() => {
      this.currentStudent = new Student(1, account, new Date().getTime() + 144000, account);
      loginSubject.next(this.currentStudent);
      loginSubject.complete();
    }, 700);
    return loginSubject;
  }

  auth(token: string): Observable<Student> {
    const student$ = new Subject<Student>();
    setTimeout(() => {
      student$.next(new Student(1, 'account', new Date().getTime() + 144000, 'token'));
      student$.complete();
    });
    return student$;
  }
}
