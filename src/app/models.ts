import {now} from 'moment';

/* Student */
export interface Student {
    id: number;
    account: string;
    expiryTime: number;
    token: string;
}

/* Problem */
export class Problem implements ProblemItem {
    private readonly C: LanguageEnv;  // Currently only supports C

    constructor(public id: number,
                public title: string,
                public description: string,
                public tags: string[],
                public languageEnvs: LanguageEnv[],
                public testcases: Testcase[]) {
        this.C = languageEnvs.filter(lang => lang.name === 'C')[0];
    }

    public get compilation() {
        return this.C ? this.C.compilation : undefined;
    }

    public get submittedCodeSpecs() {
        return this.C ? this.C.submittedCodeSpecs : [];
    }
}

export interface LanguageEnv {
    name: string;
    language: string;
    resourceSpec: ResourceSpec;
    compilation?: Compilation;
    submittedCodeSpecs: SubmittedCodeSpec[];
    providedCodesFileId?: string;
    compiledLanguage: boolean;
}

export interface ResourceSpec {
    cpu: number;
    gpu: number;
}

export interface Testcase {
    name: string;
    timeLimit: number;
    memoryLimit: number;
    outputLimit: number;
    threadNumberLimit: number;
    grade: number;
}

export interface SubmittedCodeSpec {
    format: string;
    fileName: string;
    fileExtension: string;
}

export interface Compilation {
    script: string;
}

export interface ProblemItem {
    id: number;
    title: string;
    tags: string[];
}

/* Submission */

export interface Submission {
    id: string;
    problemId: number;
    judged: boolean;
    submissionTime: number;
    submittedCodesFileId?: string;
    verdict?: Verdict;
}

export interface Verdict {
    judges: Judge[];
    summaryStatus: JudgeStatus;
    totalGrade: number;
    maximumRuntime: number;
    maximumMemoryUsage: number;
    errorMessage: string;
    issueTime: number;
    report: Map<string, any>;
}

export interface VerdictIssuedEvent {
    type: 'VerdictIssuedEvent';
    problemId: number;
    studentId: number;
    problemTitle: string;
    submissionId: string;
    verdict: Verdict;
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

export function hasRuntimeError(submission: Submission) {
    return submission?.verdict?.judges.filter(judge => isRuntimeError(judge)).length !== 0;
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

/* Exam */

export interface ExamItem {
    id: number;
    name: string;
    startTime: number;
    endTime: number;
}

export interface ExamOverview extends ExamItem {
    id: number;
    name: string;
    startTime: number;
    endTime: number;
    questions: Question[];
    description: string;
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

export interface Question {
    examId: number;
    problemTitle: string;
    problemId: number;
    yourScore: number;
    maxScore: number;
    bestRecord: Record;
    questionOrder: number;
    remainingQuota: number;
    verdict: string;
    quota: number;
}

export interface Record {
    score: number;
    status: JudgeStatus;
    maximumRuntime: number;
    maximumMemoryUsage: number;
}

export interface Answer {
    examId: number;
    problemId: number;
    studentId: number;
    submissionId: string;
    answerTime: number;
}

export function isExamClosed(exam: ExamOverview): boolean {
    const nowTime = now();
    return nowTime < exam.startTime || nowTime > exam.endTime;
}

export function findQuestion(exam: ExamOverview, problemId: number): Question {
    return exam.questions.filter(q => q.problemId === problemId)[0];
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

// TODO: maybe more refined?
export function getBetterRecord(r1?: Record, r2?: Record) {
    if (!r1) {
        return r2;
    }
    if (!r2) {
        return r1;
    }
    if (r1.score !== r2.score) {
        return r1.score - r2.score > 0 ? r1 : r2;
    }
    return r1.maximumRuntime - r2.maximumRuntime > 0 ? r1 : r2;
}

export function toRecord(verdict: Verdict): Record {
    return {
        score: verdict.totalGrade,
        status: verdict.summaryStatus,
        maximumRuntime: verdict.maximumRuntime,
        maximumMemoryUsage: verdict.maximumMemoryUsage,
    };
}

export class Pagination<E> {
    constructor(public page: number,
                public pageSize: number,
                public totalCount: number,
                public items: Array<E>) {
    }
}
