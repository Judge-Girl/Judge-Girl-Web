import {Judge, JudgeStatus, Submission, SubmissionService} from './SubmissionService';
import {Observable, Subject} from 'rxjs';

export class StubSubmissionService extends SubmissionService {

  private readonly submissionMap = new Map<number, Array<Submission>>();
  private schedulingSubject = new Subject<Submission>();

  constructor() {
    super();

    this.submissionMap.set(1, [
      new Submission(1, 1, 'AC').withJudge(JudgeStatus.AC, 2, 39.3),
      new Submission(2, 1, 'TLE').withJudge(JudgeStatus.TLE, 5, 27.6),
      new Submission(3, 1, 'CE').withJudge(JudgeStatus.CE, 5, 28.4)
    ]);

    this.submissionMap.set(2, [
      new Submission(4, 2, 'TLE').withJudge(JudgeStatus.TLE, 5, 39.3),
      new Submission(5, 2, 'TLE').withJudge(JudgeStatus.TLE, 5, 27.6),
      new Submission(6, 2, 'CE').withJudge(JudgeStatus.CE, 5, 28.4)
    ]);
  }

  getSubmissions(problemId: number): Observable<Submission> {
    const submissionSubject = new Subject<Submission>();
    setTimeout(() => {
      console.log(`Submissions of Problem(${problemId}): `);
      if (this.submissionMap[problemId]) {
        this.submissionMap[problemId].forEach(s => submissionSubject.next(s));
        submissionSubject.complete();
      } else {
        submissionSubject.error(new Error(`Problem with id ${problemId} not found.`));
      }
    }, 400);
    return submissionSubject;
  }


  submitSourceCode(problemId: number, sourceCode: string): Observable<Submission> {
    const submitSubject = new Subject<Submission>();
    setTimeout(() => {
      const id = this.submissionMap.size + 1;
      const submission = new Submission(id, problemId, sourceCode);
      this.submissionMap.get(id).push(submission);
      this.scheduleSubmission(submission);
    }, 1200);

    return submitSubject;
  }

  submitFromFile(problemId: number, file: File): Observable<Submission> {
    const submitSubject = new Subject<Submission>();
    setTimeout(() => {
      const id = this.submissionMap.size + 1;
      const submission = new Submission(id, problemId, 'AC');
      this.submissionMap.get(id).push(submission);
      this.scheduleSubmission(submission);
    }, 1200);

    return submitSubject;
  }

  private scheduleSubmission(submission: Submission) {
    setTimeout(() => {
      if (submission.sourceCode === 'AC') {
        submission.judge = new Judge(JudgeStatus.AC, 500, 5);
      } else {
        submission.judge = new Judge(JudgeStatus.CE, undefined, undefined);
      }
      this.schedulingSubject.next(submission);
    }, 8000);
  }

  get judgeObservable(): Observable<Submission> {
    return this.schedulingSubject;
  }


}
