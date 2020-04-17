import {Component, OnInit} from '@angular/core';
import {JudgeStatus, Submission} from '../services/impl/SubmissionService';
import {ActivatedRoute} from '@angular/router';
import {ProblemService, SubmissionService} from '../services/Services';
import {map, switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Problem, TestCase} from '../models';
import * as moment from 'moment';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css']
})
export class SubmissionsComponent implements OnInit {
  viewingDetailsSubmission: Submission;

  constructor(private problemService: ProblemService,
              private submissionService: SubmissionService,
              private route: ActivatedRoute) {
  }

  get bestSubmission(): Submission {
    if (!this.submissions) {
      return undefined;
    }
    let bestGrade = -1;
    let best: Submission;
    for (const submission of this.submissions) {
      if (submission.totalGrade > bestGrade) {
        bestGrade = submission.totalGrade;
        best = submission;
      }
    }
    return best;
  }

  problem$: Observable<Problem>;
  submissions$: Observable<Submission[]>;

  problem: Problem;
  testCases: TestCase[] = [];
  submissions: Submission[] = [];

  AC = JudgeStatus.AC;
  CE = JudgeStatus.CE;
  TLE = JudgeStatus.TLE;
  MLE = JudgeStatus.MLE;
  WA = JudgeStatus.WA;
  RE = JudgeStatus.RE;


  private static compareSubmissions(s1: Submission, s2: Submission): number {
    return s2.submissionTime - s1.submissionTime;
  }

  private static sortSubmissions(submissions: Submission[]): Submission[] {
    return submissions.sort(SubmissionsComponent.compareSubmissions);
  }

  async ngOnInit() {
    this.problem$ = this.route.parent.params.pipe(switchMap(params =>
      this.problemService.getProblem(+params.problemId)
    ));

    this.submissions$ = this.route.parent.params.pipe(switchMap(params =>
      this.submissionService.getSubmissions(+params.problemId)
        .pipe(map(SubmissionsComponent.sortSubmissions))
    ));

    this.problem$.subscribe(p => {
      this.problem = p;
      this.problemService.getTestCases(this.problem.id).toPromise()
        .then(testCases => this.testCases = testCases);
    });
    this.submissions$.subscribe(submissions => {
      this.submissions = SubmissionsComponent.sortSubmissions(submissions);
      console.log(`Submissions read: ${this.submissions}`);
    });

  }

  ifTheBestSubmissionStatusIs(status: JudgeStatus) {
    return this.bestSubmission && this.bestSubmission.summaryStatus === status;
  }

  onSubmissionDetailsBtnClick(submission: Submission): boolean {
    this.viewingDetailsSubmission = submission;
    return true;  // propagate the click event to the bootstrap's modal
  }

  describeTime(time: number): string {
    return moment(time).fromNow();
  }
}
