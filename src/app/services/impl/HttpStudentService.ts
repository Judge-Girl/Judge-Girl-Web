import {AccountNotFoundError, IncorrectPasswordFoundError, StudentService, UnauthenticatedError} from '../Services';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject, throwError} from 'rxjs';
import {Student} from '../../models';
import {catchError, map, retry, switchMap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {CookieService} from '../cookie/cookie.service';
import {HttpRequestCache} from './HttpRequestCache';

@Injectable({
  providedIn: 'root'
})
export class HttpStudentService extends StudentService {
  host: string;
  httpRequestCache: HttpRequestCache;

  constructor(private http: HttpClient,
              @Inject('BASE_URL') baseUrl: string,
              @Inject('PORT_STUDENT_SERVICE') port: number,
              router: Router, cookieService: CookieService) {
    super(router, cookieService);
    this.httpRequestCache = new HttpRequestCache(http);
    this.host = `${baseUrl}:${port}`;
  }

  login(account: string, password: string): Observable<Student> {
    const formData = new FormData();
    formData.set('account', account);
    formData.set('password', password);
    return this.http.post<Student>(`${this.host}/api/students/login`, formData)
      .pipe(map(student => {
        this.currentStudent = student;
        return this.currentStudent;
      }), catchError(err => {
        if (err.status === 404) {
          throw new AccountNotFoundError();
        } else if (err.status === 400) {
          throw new IncorrectPasswordFoundError();
        }
        throw new Error(`Catch unknown error from the server: ${err.status}`);
      }));
  }

  authWithTokenToTryLogin(): Observable<boolean> {
    if (this.hasLogin()) {
      return of(true);
    } else {
      return this.auth(this.cookieService.get(StudentService.KEY_TOKEN))
        .pipe(switchMap(student => of(true)))
        .pipe(catchError(err => of(false)));
    }
  }

  auth(token: string): Observable<Student> {
    if (token && token.length > 0) {
      return this.http.post<Student>(`${this.host}/api/students/auth`, null,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      ).pipe(switchMap(student => {
        this.currentStudent = student;
        return of(student);
      })).pipe(catchError(err => {
        this.currentStudent = undefined;
        return throwError(new UnauthenticatedError());
      }));
    } else {
      return throwError(new UnauthenticatedError());
    }

  }

}
