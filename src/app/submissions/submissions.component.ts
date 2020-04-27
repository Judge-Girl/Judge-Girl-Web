import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProblemService, StudentService, SubmissionService} from '../services/Services';
import {map, switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {getAverageMemory, getAverageRuntime, isJudged, JudgeStatus, Problem, Submission, SubmittedCode, TestCase} from '../models';
import * as moment from 'moment';
import * as CodeMirror from 'codemirror';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css']
})
export class SubmissionsComponent implements OnInit {
  viewingJudgesSubmission: Submission;
  loadingCodes = false;
  viewingCodes: SubmittedCode[];
  viewingCodesSubmissionCodes: Submission;

  loadingSubmissions = false;

  constructor(public studentService: StudentService,
              private problemService: ProblemService,
              private submissionService: SubmissionService,
              private route: ActivatedRoute) {
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


    this.problem$.subscribe(p => {
      this.problem = p;
      this.problemService.getTestCases(this.problem.id).toPromise()
        .then(testCases => this.testCases = testCases);
    });

    if (this.studentService.hasLogin()) {
      this.loadingSubmissions = true;
      this.submissions$ = this.route.parent.params.pipe(switchMap(params =>
        this.submissionService.getSubmissions(+params.problemId)
          .pipe(map(SubmissionsComponent.sortSubmissions))
      ));

      this.submissions$.subscribe(submissions => {
        this.submissions = SubmissionsComponent.sortSubmissions(submissions);
        this.loadingSubmissions = false;
      });
    }
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

  ifTheBestSubmissionStatusIs(status: JudgeStatus) {
    return this.bestSubmission && this.bestSubmission.summaryStatus === status;
  }

  onSubmissionJudgesBtnClick(submission: Submission): boolean {
    this.viewingJudgesSubmission = submission;
    return true;  // propagate the click event to the bootstrap's modal
  }

  onSubmissionCodesBtnClick(submission: Submission): boolean {
    this.viewingCodesSubmissionCodes = submission;
    this.loadingCodes = true;

    this.submissionService.getSubmittedCodes(this.problem.id, submission.id).toPromise()
      .then(submittedCodes => {
        this.loadingCodes = false;
        this.viewingCodes = submittedCodes;
        for (const submittedCode of submittedCodes) {
          const submittedCodeTextArea = document.getElementById(this.getSubmittedCodeElementId(submittedCode)) as HTMLTextAreaElement;
          CodeMirror.fromTextArea(submittedCodeTextArea, {
            lineNumbers: true,
            mode: 'text/x-csrc'
          });
        }
        console.log(`Submitted codes downloaded.`);
      });

    return true;  // propagate the click event to the bootstrap's modal
  }

  describeTime(time: number): string {
    return moment(time).fromNow();
  }

  isJudged(submission: Submission) {
    return isJudged(submission);
  }

  avgMemory(submission: Submission) {
    return getAverageMemory(submission);
  }

  avgRuntime(submission: Submission) {
    return getAverageRuntime(submission);
  }

  getSubmittedCodeElementId(code: SubmittedCode): string {
    return `submittedCode-${code.index}`;
  }
}
