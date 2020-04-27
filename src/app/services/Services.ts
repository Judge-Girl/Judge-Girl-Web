import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {JudgeResponse, Problem, ProblemItem, Student, Submission, TestCase} from '../models';
import {Router} from '@angular/router';
import {CookieService} from './cookie/cookie.service';


export class UnauthenticatedError extends Error {
  constructor() {
    super('The student has not authenticated.');
  }
}


export class AccountNotFoundError extends Error {
}

export class IncorrectPasswordFoundError extends Error {
}

@Injectable({
  providedIn: 'root'
})
export abstract class StudentService {
  public static readonly KEY_TOKEN = 'token';

  _currentStudent: Student;

  protected constructor(protected router: Router, protected cookieService: CookieService) {
  }

  authenticate() {
    if (!this.hasLogin()) {
      this.redirectToLoginPage();
      throw new UnauthenticatedError();
    }
  }

  hasLogin(): boolean {
    return this.currentStudent !== undefined &&
      new Date().getTime() < this.currentStudent.expiryTime;
  }

  abstract tryLogin(): Observable<boolean>;

  abstract auth(token: string): Observable<Student>;

  abstract login(account: string, password: string): Observable<Student>;

  get currentStudent(): Student {
    return this._currentStudent;
  }

  set currentStudent(student: Student) {
    this._currentStudent = student;
    this.cookieService.put(StudentService.KEY_TOKEN, student.token);
  }

  public redirectToLoginPage() {
    this.router.navigateByUrl('/');
    this.cookieService.remove(StudentService.KEY_TOKEN);
  }
}

@Injectable({
  providedIn: 'root'
})
export abstract class ProblemService {

  abstract getProblemTags(): Observable<string[]>;

  abstract getProblemItemsByTag(problemTag: string): Observable<ProblemItem[]>;

  abstract getProblemItemsInPage(page: number): Observable<ProblemItem[]>;

  abstract getProblem(problemId: number): Observable<Problem>;

  abstract getTestCases(problemId: number): Observable<TestCase[]>;
}

@Injectable({
  providedIn: 'root'
})
export abstract class SubmissionService {
  abstract get judgeObservable(): Observable<JudgeResponse>;

  abstract getSubmissions(problemId: number): Observable<Submission[]>;

  abstract submitFromFile(problemId: number, files: File[]): Observable<Submission>;
}

