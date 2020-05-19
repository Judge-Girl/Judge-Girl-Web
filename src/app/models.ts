export class Student {
  constructor(public id: number,
              public account: string,
              public expiryTime: number,
              public token: string) {
  }
}

export function studentToString(student: Student): string {
  return `{id: ${student.id}, account: ${student.account}, expiryTime: ${student.expiryTime}, token: ${student.token}}`;
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
  AC = 'AC', RE = 'RE', TLE = 'TLE', MLE = 'MLE', CE = 'CE', WA = 'WA', SYSTEM_ERR = 'SYSTEM_ERR', NONE = 'NONE'
}

export class Judge {
  errorMessage = '';

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

  _maximumRuntime: number;
  _maximumMemory: number;

  compileErrorMessage: string;

  constructor(public id: string,
              public problemId: number,) {
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

// We don't place these get-like functions into the model classes
// because when the model classes are deserialized from JSON, functions are not set to the classes.
export function isJudged(submission: Submission) {
  return submission.judges && submission.judgeTime && submission.judges.length > 0;
}

export function getMaximumRuntime(submission: Submission): number {
  if (!submission._maximumRuntime) {
    let max = -1;
    for (const judge of submission.judges) {
      if (judge.status === JudgeStatus.CE) {
        return undefined;
      } else if (max < judge.runtime) {
        max = judge.runtime;
      }
    }
    submission._maximumRuntime = max;
  }
  return submission._maximumRuntime;
}

export function getMaximumMemory(submission: Submission) {
  if (!submission._maximumMemory) {
    let max = -1;
    for (const judge of submission.judges) {
      if (judge.status === JudgeStatus.CE) {
        return undefined;
      } else if (max < judge.memory) {
        max = judge.memory;
      }
    }
    submission._maximumMemory = max;
  }
  return submission._maximumMemory;
}


export function describeMemory(memoryInBytes: number): string {
  if (!memoryInBytes || memoryInBytes < 0) {
    return '--';
  }
  if (memoryInBytes < 1024) {
    return `${memoryInBytes.toFixed(2)} B`;
  }
  memoryInBytes /= 1024;
  if (memoryInBytes < 1024) {
    return `${memoryInBytes.toFixed(2)} KB`;
  }
  memoryInBytes /= 1024;
  if (memoryInBytes < 1024) {
    return `${memoryInBytes.toFixed(2)} MB`;
  }
  memoryInBytes /= 1024;
  return `${memoryInBytes.toFixed(2)} GB`;
}

export function describeTimeInSeconds(ms: number) {
  if (!ms || ms < 0) {
    return '--';
  }
  return `${(ms / 1000).toFixed(2)} s`;
}

export class JudgeResponse {
  constructor(public problemId: number,
              public problemTitle: string,
              public submission: Submission) {
  }
}

export let JUDGE_STATUSES = [JudgeStatus.RE, JudgeStatus.TLE,
  JudgeStatus.MLE, JudgeStatus.CE, JudgeStatus.WA, JudgeStatus.AC];


export class CodeFile {
  constructor(public index: number,
              public fileName: string,
              public content: string) {
  }
}
