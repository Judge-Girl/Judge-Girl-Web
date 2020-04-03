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

  withJudge(status: JudgeStatus, runtime: number, member: number): Submission {
    this.judge = new Judge(status, runtime, member);
    return this;
  }
}

export abstract class SubmissionService {

  abstract getSubmissions(): Observable<Submission>;

  abstract submit(sourceCode: string): Observable<Submission>;
}
