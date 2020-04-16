import {Judge, JUDGE_STATUSES, JudgeResponse, JudgeStatus, Submission, SubmissionService} from './SubmissionService';
import {Observable, Subject} from 'rxjs';
import {ProblemService} from '../Services';
import {Injectable} from '@angular/core';

@Injectable(
  {providedIn: 'root'}
)
export class StubSubmissionService extends SubmissionService {

  private readonly submissionMap = new Map<number, Array<Submission>>();
  private schedulingSubject = new Subject<JudgeResponse>();

  constructor(private problemService: ProblemService) {
    super();

    this.submissionMap.set(1, [
      new Submission(1, 1).addJudge(new Judge(JudgeStatus.RE, 4, 22.3, 0)).summary(100, JudgeStatus.RE),
      new Submission(2, 1).addJudge(new Judge(JudgeStatus.AC, 8, 39.7, 40))
        .addJudge(new Judge(JudgeStatus.TLE, 8, 39.7, 0)).summary(40, JudgeStatus.TLE)
    ]);

    this.submissionMap.set(2, [
      new Submission(4, 2).addJudge(new Judge(JudgeStatus.AC, 8, 39.7, 30))
        .addJudge(new Judge(JudgeStatus.AC, 8, 39.7, 30))
        .addJudge(new Judge(JudgeStatus.TLE, 8, 39.7, 0)).summary(60, JudgeStatus.TLE),
      new Submission(5, 2).addJudge(new Judge(JudgeStatus.AC, 8, 39.7, 100)).summary(100, JudgeStatus.AC),
      new Submission(6, 2).addJudge(new Judge(JudgeStatus.CE, -1, -1, 0)).summary(0, JudgeStatus.CE),
    ]);


    this.submissionMap.set(3, [
      new Submission(7, 3).addJudge(new Judge(JudgeStatus.AC, 2, 39.3, 30)).summary(100, JudgeStatus.AC),
      new Submission(8, 3).addJudge(new Judge(JudgeStatus.AC, 2, 39.3, 30)).summary(100, JudgeStatus.AC),
      new Submission(9, 3).addJudge(new Judge(JudgeStatus.AC, 2, 39.3, 40)).summary(100, JudgeStatus.AC)
    ]);

    for (const submissions of this.submissionMap.values()) {
      const now = new Date();
      for (const submission of submissions) {
        submission.submissionTime = Math.floor(Math.random() * now.getTime());
      }
    }
  }

  getSubmissions(problemId: number): Observable<Submission[]> {
    const submissionSubject = new Subject<Submission[]>();
    setTimeout(() => {
      console.log(`Submissions of Problem(${problemId}): `);
      if (this.submissionMap.get(problemId)) {
        submissionSubject.next(this.submissionMap.get(problemId));
        submissionSubject.complete();
      } else {
        submissionSubject.error(new Error(`Problem with id ${problemId} not found.`));
      }
    }, 400);
    return submissionSubject;
  }

  submitFromFile(problemId: number, files: File[]): Observable<Submission> {
    const submitSubject = new Subject<Submission>();
    setTimeout(() => {
      const id = this.submissionMap.size + 1;
      const submission = new Submission(id, problemId);
      submission.submissionTime = new Date().getTime();
      if (!this.submissionMap.get(id)) {
        this.submissionMap.set(id, []);
      }
      this.submissionMap.get(id).push(submission);
      this.scheduleSubmission(submission);
    }, 200);

    return submitSubject;
  }

  private async scheduleSubmission(submission: Submission) {
    setTimeout(async () => {
      const problem = await this.problemService.getProblem(submission.problemId).toPromise();
      const testCases = await this.problemService.getTestCases(submission.problemId).toPromise();
      let summaryStatus = undefined;
      for (const testCase of testCases) {
        const randomStatus = JUDGE_STATUSES[Math.floor(Math.random() * JUDGE_STATUSES.length)];
        if (randomStatus === JudgeStatus.AC) {
          submission.addJudge(new Judge(JudgeStatus.AC, 500, 5, testCase.grade));
          summaryStatus = summaryStatus ? summaryStatus : JudgeStatus.AC;
        } else if (randomStatus === JudgeStatus.CE) {
          submission.addJudge(new Judge(randomStatus, undefined, undefined, 0));
          summaryStatus = summaryStatus  && summaryStatus !== JudgeStatus.AC ? summaryStatus : JudgeStatus.CE;
        } else {
          submission.addJudge(new Judge(randomStatus, 5, 5, 0));
          summaryStatus = summaryStatus  && summaryStatus !== JudgeStatus.AC ? summaryStatus : randomStatus;
        }
        submission.summaryStatus = summaryStatus;
        submission.judgeTime = new Date().getTime();
      }
      this.schedulingSubject.next(new JudgeResponse(problem.id, problem.title, submission));
    }, 400);
  }

  get judgeObservable(): Observable<JudgeResponse> {
    return this.schedulingSubject;
  }


}
