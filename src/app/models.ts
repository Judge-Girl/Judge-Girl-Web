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

  constructor(public testcaseName: string,
              public status: JudgeStatus,
              public programProfile: ProgramProfile,
              public grade: number) {
  }
}

export class ProgramProfile {
  constructor(public runtime: number,
              public memoryUsage: number,
              public errorMessage: string) {
  }
}

export class Submission {
  verdict: Verdict;
  isJudged: boolean;
  submissionTime: number;
  judgeTime: number;
  submittedCodesFileId: string;

  constructor(public id: string,
              public problemId: number) {
  }

}

export class Verdict {
  constructor(public judges: Judge[],
              public summaryStatus: JudgeStatus,
              public totalGrade: number,
              public maximumRuntime: number,
              public maximumMemoryUsage: number,
              public compileErrorMessage: string,
              public issueTime: number,
              public report: Map<string, any>) {
  }
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

export class VerdictIssuedEvent {
  constructor(public problemId: number,
              public problemTitle: string,
              public submissionId: string,
              public verdict: Verdict) {
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


export function getCodeFileExtension(codeSpec: SubmittedCodeSpec): string {
  const lang = codeSpec.language.toLowerCase();
  switch (lang) {
    case 'c':
      return '.c';
    case 'java':
      return '.java';
    case 'open_cl':
      return '.cl';
    case 'cuda':
      return '.cu';
    default:
      throw new Error(`The language not supported, given ${lang}`);
  }
}
