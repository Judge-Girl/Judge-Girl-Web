import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {
  CodeFile,
  Exam,
  ExamItem,
  Problem,
  ProblemItem,
  Student,
  Submission,
  TestCase,
  VerdictIssuedEvent
} from '../models';
import {Router} from '@angular/router';
import {CookieService} from './cookie/cookie.service';
import {ExamStatus} from './impl/HttpExamService';


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
  constructor() {
    super('You have attempted to run code too soon. Please try again in a few seconds');
  }
}

@Injectable({
  providedIn: 'root'
})
export abstract class StudentService {
  public static readonly KEY_TOKEN = 'token';
  private student$ = new Subject<Student>();

  _currentStudent: Student;

  protected constructor(protected router: Router, protected cookieService: CookieService) {
  }

  authenticate(): boolean {
    if (!this.hasLogin()) {
      this.redirectToLoginPage();
      // console.log(`The student has not authenticated.`);
      return false;
    }
    return true;
  }

  hasLogin(): boolean {
    if (!this.cookieService.get(StudentService.KEY_TOKEN)) {
      // [Sync] if the token is removed, then the student should also be removed
      this.currentStudent = null;
      return false;
    }
    return this.currentStudent && this.currentStudent.expiryTime && this.currentStudent.token &&
      new Date().getTime() < this.currentStudent.expiryTime;
  }


  abstract tryAuthWithCurrentToken(): Observable<boolean>;

  abstract auth(token: string): Observable<Student>;

  abstract login(account: string, password: string): Observable<Student>;

  abstract changePassword(oldPassword: string, newPassword: string): Observable<boolean>;

  abstract logout();

  get currentStudentObservable(): Observable<Student> {
    return this.student$;
  }

  get currentStudent(): Student {
    return this._currentStudent;
  }

  set currentStudent(student: Student) {
    this._currentStudent = student;
    if (student) {
      // console.log(`Set current student to ${studentToString(student)}.`);
      this.student$.next(student);
      this.cookieService.put(StudentService.KEY_TOKEN, student.token);
    } else {
      this.cookieService.remove(StudentService.KEY_TOKEN);
    }
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
export abstract class ExamService {

  abstract getExamOverview(examId: number): Observable<Exam>;

  abstract getExamsByStudentId(studentId: number, examStatus?: ExamStatus,
                               skip?: number, size?: number): Observable<ExamItem[]>;
}

@Injectable({
  providedIn: 'root'
})
export abstract class SubmissionService {
  abstract get verdictIssuedEventObservable(): Observable<VerdictIssuedEvent>;

  abstract getSubmissions(problemId: number): Observable<Submission[]>;

  abstract submitFromFile(problemId: number, files: File[]): Observable<Submission>;

  abstract getSubmittedCodes(problemId: number, submissionId: string,
                             submittedCodesFileId: string): Observable<CodeFile[]>;
}

@Injectable({
  providedIn: 'root'
})
export abstract class BrokerService {
  abstract connect();

  abstract disconnect();

  abstract subscribe(topic: string, subscriber: (message: BrokerMessage) => void): void;
}

export class BrokerMessage {
  constructor(public command: string, public headers: Map<string, string>,
              public body: string, public isBinaryBody: boolean, public binary: Uint8Array) {
  }
}




