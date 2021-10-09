import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {
  CodeFile,
  ExamItem,
  ExamOverview,
  Problem,
  ProblemItem,
  Student,
  Submission,
  SubmittedCodeSpec,
  VerdictIssuedEvent
} from '../app/models';
import {Router} from '@angular/router';
import {CookieService} from './cookie/cookie.service';
import {ExamStatus} from './impl/HttpExamService';
import {filter, map, startWith} from 'rxjs/operators';


export class UnauthenticatedError extends Error {
  constructor() {
    super('The student has not authenticated.');
  }
}

export class AccountNotFoundError extends Error {
}

export class IncorrectPasswordFoundError extends Error {
}

export class NoSubmissionQuota extends Error {
  constructor() {
    super('You have no remaining submission quota.');
  }
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
  protected currentStudentSubject = new ReplaySubject<Student | undefined>(1);
  protected loginStudentSubject = this.currentStudentSubject.pipe(filter(student => !!student));
  protected awaitAuthSubject = this.currentStudentSubject.pipe(map(student => !!student));
  protected hasLoginSubject = this.awaitAuthSubject.pipe(startWith(false));
  student: Student;


  protected constructor(protected router: Router, protected cookieService: CookieService) {
  }

  tryAuthFromCookie() {
    this.auth(this.cookieService.get(StudentService.KEY_TOKEN))
      .toPromise().then(() => {});
  }

  abstract auth(token: string): Observable<Student>;

  abstract login(account: string, password: string): Observable<Student>;

  abstract changePassword(oldPassword: string, newPassword: string): Observable<boolean>;

  logout() {
    this.currentStudent = undefined;
  }

  get currentStudent(): Student {
    return this.student;
  }

  set currentStudent(student: Student) {
    const newStudent = this.student?.id !== student?.id;
    this.student = student;
    if (student) {
      if (newStudent) {
        this.currentStudentSubject.next(student);
      }
      this.cookieService.put(StudentService.KEY_TOKEN, student.token);
    } else {
      this.currentStudentSubject.next(undefined);
      this.cookieService.remove(StudentService.KEY_TOKEN);
    }
  }

  /**
   * Observe the currently login student.
   */
  get loginStudent$(): Observable<Student> {
    return this.loginStudentSubject;
  }

  /**
   * Observe the authentication result, in return of a boolean value indicates the success or failure.
   */
  get awaitAuth$(): Observable<boolean> {
    return this.awaitAuthSubject;
  }

  /**
   * Observe the login status, starts with false.
   */
  get hasLogin$(): Observable<boolean> {
    return this.hasLoginSubject;
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
}

@Injectable({
  providedIn: 'root'
})
export abstract class ExamService {

  abstract getExamProgressOverview(studentId: number, examId: number): Observable<ExamOverview>;

  abstract getExamsByStudentId(studentId: number, examStatus?: ExamStatus,
                               skip?: number, size?: number): Observable<ExamItem[]>;
}

@Injectable({
  providedIn: 'root'
})
export abstract class SubmissionService {
  verdictIssuedEvents$: Observable<VerdictIssuedEvent>;
  abstract getSubmissions(problemId: number): Observable<Submission[]>;

  abstract submitFromFile(problemId: number, submittedCodeSpecs: SubmittedCodeSpec[], files: File[]): Observable<Submission>;

  abstract getSubmittedCodes(problemId: number, submissionId: string,
                             submittedCodesFileId: string): Observable<CodeFile[]>;
}

@Injectable({
  providedIn: 'root'
})
export abstract class BrokerService {
  abstract connect();

  abstract disconnect();

  abstract subscribe(subscriberName: string, topic: string, subscriber: Subscriber): Unsubscribe;
}

export type Subscriber = (message: BrokerMessage) => void;
export type Unsubscribe = () => void;

export class BrokerMessage {
  constructor(public command: string, public headers: Map<string, string>,
              public body: string, public isBinaryBody: boolean, public binary: Uint8Array) {
  }
}




