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
  baseUrl: string;
  httpRequestCache: HttpRequestCache;

  constructor(private http: HttpClient,
              @Inject('STUDENT_SERVICE_BASE_URL') baseUrl: string,
              router: Router, cookieService: CookieService) {
    super(router, cookieService);
    this.httpRequestCache = new HttpRequestCache(http);
    this.baseUrl = baseUrl;
  }

  getAuthHeaders(): Object {
    const token = this.cookieService.get(StudentService.KEY_TOKEN);
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };
  }

  login(email: string, password: string): Observable<Student> {
    return this.http.post<Student>(`${this.baseUrl}/api/students/login`,
      {email, password})
      .pipe(map(student => {
        this.currentStudent = student;
        return this.currentStudent;
      }), catchError(err => {
        if (err.status === 404) {
          throw new AccountNotFoundError();
        } else if (err.status === 400) {
          throw new IncorrectPasswordFoundError();
        }

        throw new Error(`Catch unknown error from the server: ${err.status}, ${err.toString()}`);
      }));
  }

  tryAuthWithCurrentToken(): Observable<boolean> {
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
      return this.http.post<Student>(`${this.baseUrl}/api/students/auth`, null, 
        this.getAuthHeaders(),
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
    }, this.getAuthHeaders()).pipe(catchError(err => {
      if (err.status === 400) {
        return throwError(new IncorrectPasswordFoundError());
      } else {
        return throwError(new Error(`Catch unknown error from the server: ${err.status}, ${err.toString()}`));
      }
    }));
  }

}
