import {JudgeStatus, Submission, SubmissionService} from './SubmissionService';
import {Observable, Subject} from 'rxjs';

export class StubSubmissionService extends SubmissionService {

  getSubmissions(): Observable<Submission> {
    const submissionSubject = new Subject<Submission>();
    setTimeout(() => {
      submissionSubject.next(new Submission(1, 1, 'AC').withJudge(JudgeStatus.AC, 2, 39.3));
      submissionSubject.next(new Submission(2, 1, 'TLE').withJudge(JudgeStatus.TLE, 5, 27.6));
      submissionSubject.next(new Submission(3, 1, 'CE').withJudge(JudgeStatus.CE, 5, 28.4));
      submissionSubject.complete();
    }, 400);
    return submissionSubject;
  }

  submit(sourceCode: string): Observable<Submission> {
    return undefined;
  }

}
