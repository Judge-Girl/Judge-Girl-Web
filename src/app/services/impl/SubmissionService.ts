import {Observable} from 'rxjs';

export enum JudgeStatus {
  AC = 'AC', RE = 'RE', TLE = 'TLE', MLE = 'MLE', CE = 'CE', WA = 'WA'
}

export let JUDGE_STATUSES = [JudgeStatus.AC, JudgeStatus.RE, JudgeStatus.TLE,
  JudgeStatus.MLE, JudgeStatus.CE, JudgeStatus.WA];

export class Judge {
  constructor(public status: JudgeStatus,
              public runtime: number,
              public memory: number,
              public grade: number) {
  }
}

export class Submission {
  judges: Judge[] = [];
  summaryStatus: JudgeStatus;
  totalGrade: number;
  submissionTime: number;
  judgeTime: number;

  _averageRuntime: number;
  _averageMemory: number;

  constructor(public id: number,
              public problemId: number) {
  }

  addJudge(judge: Judge): Submission {
    this.judges.push(judge);
    return this;
  }

  summary(totalGrade: number, status: JudgeStatus): Submission {
    this.totalGrade = totalGrade;
    this.summaryStatus = status;
    return this;
  }

  get averageRuntime(): number {
    let sum = 0;
    if (!this._averageRuntime) {
      for (const judge of this.judges) {
        if (judge.status === JudgeStatus.CE) {
          return undefined;
        } else {
          sum += judge.runtime;
        }
      }
      this._averageRuntime = sum / this.judges.length;
    }
    return this._averageRuntime;
  }

  get averageMemory(): number {
    let sum = 0;
    if (!this._averageMemory) {
      for (const judge of this.judges) {
        if (judge.status === JudgeStatus.CE) {
          return undefined;
        } else {
          sum += judge.memory;
        }
      }
      this._averageMemory = sum / this.judges.length;
    }
    return this._averageMemory;
  }
}


export class JudgeResponse {
  constructor(public problemId: number,
              public problemTitle: string,
              public submission: Submission) {
  }
}

export abstract class SubmissionService {
  abstract get judgeObservable(): Observable<JudgeResponse>;

  abstract getSubmissions(problemId: number): Observable<Submission[]>;

  abstract submitFromFile(problemId: number, files: File[]): Observable<Submission>;
}
