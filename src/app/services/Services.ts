import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Problem, ProblemItem, TestCase} from '../models';
import {JudgeResponse, Submission} from './impl/SubmissionService';

@Injectable({
  providedIn: 'root'
})
export abstract class LoginService {
  hasLogin = false;

  abstract login(studentId: string, password: string): Observable<any>;
}

@Injectable({
  providedIn: 'root'
})
export abstract class ProblemService {

  abstract getProblemTags(): Observable<string>;

  abstract getProblemItemsByTag(problemTag: string): Observable<ProblemItem>;

  abstract getProblemItemsInPage(page: number): Observable<ProblemItem>;

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
