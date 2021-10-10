import {AccountNotFoundError, IncorrectPasswordFoundError, StudentService, UnauthenticatedError} from '../Services';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {Student} from '../../models';
import {environment} from '../../../environments/environment';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpStudentService extends StudentService {
  baseUrl: string;

  constructor(private http: HttpClient) {
    super();
    this.baseUrl = environment.problemServiceBaseUrl;
  }

  login(email: string, password: string): Observable<Student> {
    return this.http.post<Student>(`${this.baseUrl}/api/students/login`,
      {email, password})
      .pipe(catchError(err => {
        if (err.status === 404) {
          return throwError(new AccountNotFoundError());
        } else if (err.status === 400) {
          return throwError(new IncorrectPasswordFoundError());
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
      ).pipe(catchError(() => {
        return throwError(new UnauthenticatedError());
      }));
    } else {
      return throwError(new UnauthenticatedError());
    }
  }

  changePassword(studentId: number, oldPassword: string, newPassword: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/api/students/${studentId}/password`, {
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
