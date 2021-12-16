import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
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
} from '../models';
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

  abstract auth(token: string): Observable<Student>;

  abstract login(account: string, password: string): Observable<Student>;

  abstract changePassword(studentId: number, oldPassword: string, newPassword: string): Observable<void>;

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

  abstract getProblem(problemId: number, examId: number): Observable<Problem>;
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




