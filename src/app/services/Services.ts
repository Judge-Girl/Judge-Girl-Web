import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CodeFile, JudgeResponse, Problem, ProblemItem, Student, studentToString, Submission, TestCase} from '../models';
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

export class SubmissionThrottlingError extends Error {
  constructor(message: string) {
    super(message);
  }
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
    return this.currentStudent && this.currentStudent.expiryTime && this.currentStudent.token &&
      new Date().getTime() < this.currentStudent.expiryTime;
  }


  abstract tryAuthWithCurrentToken(): Observable<boolean>;

  abstract auth(token: string): Observable<Student>;

  abstract login(account: string, password: string): Observable<Student>;

  public logout() {
    this.currentStudent = undefined;
  }

  get currentStudent(): Student {
    return this._currentStudent;
  }

  set currentStudent(student: Student) {
    this._currentStudent = student;
    if (student) {
      console.log(`Set current student to ${studentToString(student)}.`);
      this.cookieService.put(StudentService.KEY_TOKEN, student.token);
    } else {
      this.cookieService.remove(StudentService.KEY_TOKEN);
    }
  }

  public skipLoginPage() {
    this.router.navigateByUrl('/problems');
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

  abstract getSubmittedCodes(problemId: number, submissionId: string): Observable<CodeFile[]>;
}


