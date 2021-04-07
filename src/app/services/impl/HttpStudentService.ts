import {AccountNotFoundError, IncorrectPasswordFoundError, StudentService, UnauthenticatedError} from '../Services';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {Student} from '../../models';
import {catchError, map, switchMap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {CookieService} from '../cookie/cookie.service';
import {HttpRequestCache} from './HttpRequestCache';

@Injectable({
  providedIn: 'root'
})
export class HttpStudentService extends StudentService {
  baseUrl: string;
  httpRequestCache: HttpRequestCache;
  private hasLogin$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient,
              @Inject('STUDENT_SERVICE_BASE_URL') baseUrl: string,
              router: Router, cookieService: CookieService) {
    super(router, cookieService);
    this.httpRequestCache = new HttpRequestCache(http);
    this.baseUrl = baseUrl;
  }

  login(email: string, password: string): Observable<Student> {
    return this.http.post<Student>(`${this.baseUrl}/api/students/login`,
      {email, password})
      .pipe(map(student => {
        this.currentStudent = student;
        this.hasLogin$.next(true);
        return this.currentStudent;
      }), catchError(err => {
        if (err.status === 404) {
          throw new AccountNotFoundError();
        } else if (err.status === 400) {
          throw new IncorrectPasswordFoundError();
        } else {
          throw new Error(`Catch unknown error from the server: ${err.status}, ${err.toString()}`);
        }
      }));
  }

  tryAuthWithCurrentToken(): Observable<boolean> {
    if (this.hasLogin()) {
      // console.log('[Authentication]: has login.');
      this.hasLogin$.next(true);
    } else {
      this.hasLogin$.next(false);
      this.auth(this.cookieService.get(StudentService.KEY_TOKEN))
        .toPromise()
        .then(student => this.hasLogin$.next(true))
        .catch(err => this.hasLogin$.next(false));
    }
    return this.hasLogin$;
  }

  auth(token: string): Observable<Student> {
    if (token && token.length > 0) {
      // console.log('[Authentication]: authenticating...');
      return this.http.post<Student>(`${this.baseUrl}/api/students/auth`, null,
        this.getHttpOptions(),
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

  changePassword(oldPassword: string, newPassword: string): Observable<boolean> {
    return this.http.patch<boolean>(`${this.baseUrl}/api/students/${this.currentStudent.id}/password`, {
      currentPassword: oldPassword,
      newPassword,
    }, this.getHttpOptions()).pipe(catchError(err => {
      if (err.status === 400) {
        return throwError(new IncorrectPasswordFoundError());
      } else {
        return throwError(new Error(`Catch unknown error from the server: ${err.status}, ${err.toString()}`));
      }
    }));
  }

  logout() {
    this.currentStudent = null;
    this.hasLogin$.next(false);
  }

  getHttpOptions(): { headers: HttpHeaders } {
    const token = this.cookieService.get(StudentService.KEY_TOKEN);
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }


}
