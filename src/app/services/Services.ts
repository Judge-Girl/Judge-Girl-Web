import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {JudgeResponse, Problem, ProblemItem, Student, Submission, TestCase} from '../models';
import {Router} from '@angular/router';


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
  currentStudent: Student;

  constructor(protected router: Router) {
  }

  authenticate() {
    if (!this.isAuthenticated()) {
      this.router.navigateByUrl('/');
      throw new UnauthenticatedError();
    }
  }

  isAuthenticated(): boolean {
    return this.currentStudent !== undefined &&
      new Date().getTime() < this.currentStudent.expiryTime;
  }

  abstract login(account: string, password: string): Observable<Student>;
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
