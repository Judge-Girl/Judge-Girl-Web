import {Observable} from 'rxjs';

export enum JudgeStatus {
  AC = 'AC', RE = 'RE', TLE = 'TLE', MLE = 'MLE', CE = 'CE', WA = 'WA'
}

export class Judge {
  constructor(public status: JudgeStatus,
              public runtime: number,
              public memory: number) {
  }
}

export class Submission {
  judge: Judge;

  constructor(public id: number,
              public problemId: number,
              public sourceCode: string) {
  }

  withJudge(status: JudgeStatus, runtime: number, memory: number): Submission {
    this.judge = new Judge(status, runtime, memory);
    return this;
  }
}

export abstract class SubmissionService {
  abstract get judgeObservable(): Observable<Submission>;

  abstract getSubmissions(problemId: number): Observable<Submission>;

  abstract submitFromFile(problemId: number, file: File): Observable<Submission>;
  abstract submitSourceCode(problemId: number, sourceCode: string): Observable<Submission>;
}
