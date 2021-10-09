import {AccountNotFoundError, IncorrectPasswordFoundError, StudentService, UnauthenticatedError} from '../Services';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {Student} from '../../app/models';
import {catchError, map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {CookieService} from '../cookie/cookie.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpStudentService extends StudentService {
  baseUrl: string;

  constructor(private http: HttpClient,
              router: Router, cookieService: CookieService) {
    super(router, cookieService);
    this.baseUrl = environment.problemServiceBaseUrl;
  }

  login(email: string, password: string): Observable<Student> {
    return this.http.post<Student>(`${this.baseUrl}/api/students/login`,
      {email, password})
      .pipe(map(student => {
        return this.currentStudent = student;
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

  auth(token: string): Observable<Student> {
    if (token && token.length > 0) {
      return this.http.post<Student>(`${this.baseUrl}/api/students/auth`, null,
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`
          })
        },
      ).pipe(map(student => {
        return this.currentStudent = student;
      })).pipe(catchError(() => {
        this.currentStudent = undefined;
        return throwError(new UnauthenticatedError());
      }));
    } else {
      this.currentStudent = undefined;
      return throwError(new UnauthenticatedError());
    }
  }

  changePassword(oldPassword: string, newPassword: string): Observable<boolean> {
    return this.http.patch<boolean>(`${this.baseUrl}/api/students/${this.currentStudent.id}/password`, {
      currentPassword: oldPassword,
      newPassword,
    }).pipe(catchError(err => {
      if (err.status === 400) {
        return throwError(new IncorrectPasswordFoundError());
      } else {
        return throwError(new Error(`Catch unknown error from the server: ${err.status}, ${err.toString()}`));
      }
    }));
  }

}
