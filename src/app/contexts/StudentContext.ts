import {Student} from '../models';
import {Injectable} from '@angular/core';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {StudentService} from '../services/Services';
import {filter, map, startWith} from 'rxjs/operators';
import {Router} from '@angular/router';
import {CookieService} from '../services/cookie/cookie.service';

const COOKIE_KEY_TOKEN = 'token';

@Injectable({
    providedIn: 'root'
  }
)
export class StudentContext {

  /**
   * Observe the current student.
   * If the student logs in, this propagates a new student instance;
   * if the student logs out, this propagates an undefined value.
   */
  public currentStudent$: Subject<Student> = new ReplaySubject<Student | undefined>(1);

  /**
   * Observe only the login event with the student instance.
   */
  public loginStudent$: Observable<Student> = this.currentStudent$.pipe(filter(student => !!student));

  /**
   * Observe every authentication result, in return of a boolean value indicates the success or failure.
   */
  public awaitAuth$: Observable<boolean> = this.currentStudent$.pipe(map(student => !!student));

  /**
   * Observe the login status, starts with false.
   */
  public hasLogin$: Observable<boolean> = this.awaitAuth$.pipe(startWith(false));

  public currentStudent?: Student;

  protected constructor(private router: Router,
                        private cookieService: CookieService,
                        private studentService: StudentService) {
  }

  tryAuth() {
    this.studentService.auth(this.cookieService.get(COOKIE_KEY_TOKEN)).toPromise()
      .then(student => this.updateCurrentStudent(student))
      .catch((err) => this.clearCurrentStudent(err));
  }

  logout() {
    this.clearCurrentStudent(undefined);
  }

  public updateCurrentStudent(student: Student) {
    if (student) {
      this.currentStudent = student;
      this.currentStudent$.next(student);
      this.cookieService.put(COOKIE_KEY_TOKEN, student.token);
    }
    return this.currentStudent;
  }

  public clearCurrentStudent(err) {
    this.currentStudent$.next(undefined);
    this.cookieService.remove(COOKIE_KEY_TOKEN);
  }
}
