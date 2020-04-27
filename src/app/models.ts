export class Student {
  constructor(public id: number,
              public account: string,
              public expiryTime: number,
              public token: string) {
  }
}

export class TestCase {
  constructor(public name: string,
              public timeLimit: number,
              public memoryLimit: number,
              public outputLimit: number,
              public threadNumberLimit: number,
              public grade: number) {
  }
}

export class ProblemItem {
  constructor(public id: number,
              public title: string) {
  }
}

export class JudgeSpec {
  constructor(public language: string,
              public environment: string,
              public cpu: number,
              public gpu: number) {
  }
}

export class SubmittedCodeSpec {
  constructor(public language: string, public fileName: string) {
  }
}

export class Compilation {
  constructor(public script: string) {
  }
}

export class Problem extends ProblemItem {
  constructor(id: number, title: string,
              public markdownDescription: string,
              public problemTags: string[],
              public submittedCodeSpecs: SubmittedCodeSpec[],
              public zippedProvidedCodesFileId: string,
              public compilation: Compilation) {
    super(id, title);
  }
}

export enum JudgeStatus {
  AC = 'AC', RE = 'RE', TLE = 'TLE', MLE = 'MLE', CE = 'CE', WA = 'WA'
}

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
  totalGrade = 0;
  submissionTime: number;
  judgeTime: number;

  _averageRuntime: number;
  _averageMemory: number;

  constructor(public id: number,
              public problemId: number) {
  }

  setJudges(judges: Judge[]): Submission {
    this.judges = judges;
    return this;
  }

  addJudge(judge: Judge): Submission {
    this.judges.push(judge);
    return this;
  }

  setSubmissionTime(submissionTime: number): Submission {
    this.submissionTime = submissionTime;
    return this;
  }

  summary(totalGrade: number, status: JudgeStatus): Submission {
    this.totalGrade = totalGrade;
    this.summaryStatus = status;
    return this;
  }

}

export function isJudged(submission: Submission) {
  return submission.judges && submission.judges.length > 0;
}

export function getAverageRuntime(submission: Submission) {
  let sum = 0;
  if (!submission._averageRuntime) {
    for (const judge of submission.judges) {
      if (judge.status === JudgeStatus.CE) {
        return undefined;
      } else {
        sum += judge.runtime;
      }
    }
    submission._averageRuntime = sum / submission.judges.length;
  }
  return submission._averageRuntime.toFixed(2);
}

export function getAverageMemory(submission: Submission) {
  let sum = 0;
  if (!submission._averageRuntime) {
    for (const judge of submission.judges) {
      if (judge.status === JudgeStatus.CE) {
        return undefined;
      } else {
        sum += judge.runtime;
      }
    }
    submission._averageRuntime = sum / submission.judges.length;
  }
  return submission._averageRuntime.toFixed(2);
}

export class JudgeResponse {
  constructor(public problemId: number,
              public problemTitle: string,
              public submission: Submission) {
  }
}

export let JUDGE_STATUSES = [JudgeStatus.RE, JudgeStatus.TLE,
  JudgeStatus.MLE, JudgeStatus.CE, JudgeStatus.WA, JudgeStatus.AC];


export class SubmittedCode {
  constructor(public index: number,
              public fileName: string,
              public content: string) {
  }
}
