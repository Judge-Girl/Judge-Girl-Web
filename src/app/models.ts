import {now} from 'moment';

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

export class JudgeSpec {
  constructor(public language: string,
              public environment: string,
              public cpu: number,
              public gpu: number) {
  }
}

export class SubmittedCodeSpec {
  constructor(public format: string,
              public fileName: string,
              public fileExtension: string) {
  }
}

export class Compilation {
  constructor(public script: string) {
  }
}

export class ProblemItem {
  constructor(public id: number,
              public title: string,
              public tags: string[]) {
  }
}

export class Problem extends ProblemItem {
  private readonly C: LanguageEnv;  // Currently only supports C

  constructor(id: number, title: string,
              public description: string,
              public tags: string[],
              public languageEnvs: LanguageEnv[],
              public testcases: TestCase[]) {
    super(id, title, tags);
    this.C = languageEnvs.filter(lang => lang.name === 'C')[0];
  }

  public get compilation() {
    return this.C ? this.C.compilation : undefined;
  }

  public get submittedCodeSpecs() {
    return this.C ? this.C.submittedCodeSpecs : [];
  }
}

export class LanguageEnv {
  constructor(public name: string,
              public language: string,
              public compilation: Compilation,
              public submittedCodeSpecs: SubmittedCodeSpec[],
              public providedCodesFileId: string,
              public compiledLanguage: boolean) {
  }
}

export class ExamItem {
  constructor(public id: number,
              public name: string,
              public startTime: number,
              public endTime: number) {
  }
}

export enum ExamStatus {
  CLOSED, ONGOING, UPCOMING
}

export function getExamStatus(exam: { startTime: number, endTime: number }): ExamStatus {
  const time = now();
  if (exam.startTime <= time && time <= exam.endTime) {
    return ExamStatus.ONGOING;
  }
  if (time < exam.startTime) {
    return ExamStatus.UPCOMING;
  }
  return ExamStatus.CLOSED;
}

export class ExamOverview extends ExamItem {
  constructor(public id: number,
              public name: string,
              public startTime: number,
              public endTime: number,
              public questions: QuestionItem[],
              public description: string) {
    super(id, name, startTime, endTime);
  }
}

export function isExamClosed(exam: ExamOverview): boolean {
  const nowTime = now();
  return nowTime < exam.startTime || nowTime > exam.endTime;
}

export function getQuestion(exam: ExamOverview, problemId: number): QuestionItem {
  return exam.questions.filter(q => q.problemId === problemId)[0];
}

export class QuestionItem {
  constructor(public examId: number,
              public problemTitle: string,
              public problemId: number,
              public yourScore: number,
              public maxScore: number,
              public bestRecord: Record,
              public questionOrder: number,
              public remainingQuota: number,
              public verdict: string,
              public quota: number) {
  }
}

export class Record {
  constructor(public score: number,
              public status: JudgeStatus,
              public maximumRuntime: number,
              public maximumMemoryUsage: number,
              public submissionTime: number) {
  }
}

// TODO: maybe more refined?
export function getBetterRecord(r1: Record, r2: Record) {
  if (r1.score !== r2.score) {
    return r1.score - r2.score > 0 ? r1 : r2;
  }
  return r1.maximumRuntime - r2.maximumRuntime > 0 ? r1 : r2;
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

export function isRuntimeError(judge: Judge): boolean {
  return judge?.status === JudgeStatus.RE;
}

export class ProgramProfile {
  constructor(public runtime: number,
              public memoryUsage: number,
              public errorMessage: string) {
  }
}

export class Submission {
  verdict: Verdict;
  judged: boolean;
  submissionTime: number;
  submittedCodesFileId: string;

  constructor(public id: string,
              public problemId: number) {
  }

}

export function hasRuntimeError(submission: Submission) {
  return submission?.verdict?.judges.filter(judge => isRuntimeError(judge)).length !== 0;
}

export function getBestRecord(submissions: Submission[]): Submission {
  if (!submissions) {
    return undefined;
  }
  let bestGrade = -1;
  let best: Submission;
  for (const submission of submissions) {
    if (submission.judged &&
      submission.verdict.totalGrade > bestGrade) {
      bestGrade = submission.verdict.totalGrade;
      best = submission;
    }
  }
  return best;
}

export class Answer {

  constructor(public examId: number,
              public problemId: number, public studentId: number,
              public submissionId: string, public answerTime: number) {
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
              // TODO: report type should be declared in a recursive way
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
              public studentId: number,
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
  const lang = codeSpec.format.toLowerCase();
  switch (lang) {
    case 'c':
      return '.c';
    case 'cpp':
      return '.cpp';
    case 'open_cl':
      return '.cl';
    case 'cuda':
      return '.cu';
    case 'java':
      return '.java';
    case 'javascript':
      return '.js';
    case 'python':
      return '.py';
    case 'golang':
      return '.go';
    default:
      throw new Error(`The language ${lang} is not supported.`);
  }
}
