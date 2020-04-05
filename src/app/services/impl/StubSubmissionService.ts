import {JudgeStatus, Submission, SubmissionService} from './SubmissionService';
import {Observable, Subject} from 'rxjs';

export class StubSubmissionService extends SubmissionService {

  private readonly submissionMap: { [key: number]: Array<Submission>; } = {
    1: [
      new Submission(1, 1, 'AC').withJudge(JudgeStatus.AC, 2, 39.3),
      new Submission(2, 1, 'TLE').withJudge(JudgeStatus.TLE, 5, 27.6),
      new Submission(3, 1, 'CE').withJudge(JudgeStatus.CE, 5, 28.4)
    ],
    2: [
      new Submission(4, 2, 'TLE').withJudge(JudgeStatus.TLE, 5, 39.3),
      new Submission(5, 2, 'TLE').withJudge(JudgeStatus.TLE, 5, 27.6),
      new Submission(6, 2, 'CE').withJudge(JudgeStatus.CE, 5, 28.4)
    ]
  };

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

  submit(problemId: number, sourceCode: string): Observable<Submission> {
    return undefined;
  }

}
