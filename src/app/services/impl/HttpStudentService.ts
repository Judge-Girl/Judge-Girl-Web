import {AccountNotFoundError, IncorrectPasswordFoundError, StudentService} from '../Services';
import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Student} from '../../models';
import {catchError, map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpStudentService extends StudentService {
  host: string;

  constructor(private http: HttpClient,
              @Inject('BASE_URL') baseUrl: string,
              @Inject('PORT_STUDENT_SERVICE') port: number,
              router: Router) {
    super(router);
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

}
