import {AccountNotFoundError, IncorrectPasswordFoundError, StudentService, UnauthenticatedError} from '../Services';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {Student} from '../../app/models';
import {catchError, map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {CookieService} from '../cookie/cookie.service';

@Injectable({
  providedIn: 'root'
})
export class HttpStudentService extends StudentService {
  baseUrl: string;

  constructor(private http: HttpClient,
              @Inject('STUDENT_SERVICE_BASE_URL') baseUrl: string,
              router: Router, cookieService: CookieService) {
    super(router, cookieService);
    this.baseUrl = baseUrl;
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
        this.getHttpOptions(),
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
    }, this.getHttpOptions()).pipe(catchError(err => {
      if (err.status === 400) {
        return throwError(new IncorrectPasswordFoundError());
      } else {
        return throwError(new Error(`Catch unknown error from the server: ${err.status}, ${err.toString()}`));
      }
    }));
  }

  getHttpOptions(): { headers: HttpHeaders } {
    const token = this.cookieService.get(StudentService.KEY_TOKEN);
    return {
      headers: new HttpHeaders({
        Authorization: `bearer ${token}`
      })
    };
  }


}
