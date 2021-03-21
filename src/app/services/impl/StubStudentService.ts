import {StudentService} from '../Services';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Student} from '../../models';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {CookieService} from '../cookie/cookie.service';

@Injectable(
  {
    providedIn: 'root'
  }
)
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
      student$.next(this.currentStudent = new Student(1, 'account', new Date().getTime() + 144000, 'token'));
      student$.complete();
    });
    return student$;
  }

  tryAuthWithCurrentToken(): Observable<boolean> {
    if (this.hasLogin()) {
      return new BehaviorSubject(true);
    } else {
      const login$ = new Subject<boolean>();
      this.auth(this.cookieService.get(StudentService.KEY_TOKEN)).toPromise()
        .then(s => {
          login$.next(true);
          login$.complete();
        }).catch(err => {
        login$.next(false);
        login$.complete();
      });
      return login$;
    }
  }

  resetPassword(oldPassword: string, newPassword: string): Observable<boolean> {
    const $ = new Subject<boolean>();
    setTimeout(() => $.next(true), 123);
    return $;
  }
}
