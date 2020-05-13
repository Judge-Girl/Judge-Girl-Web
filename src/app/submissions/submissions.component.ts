import {AfterViewInit, Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProblemService, StudentService, SubmissionService} from '../services/Services';
import {map, switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {getMaximumMemory, getMaximumRuntime, isJudged, JudgeStatus, Problem, Submission, CodeFile, TestCase} from '../models';
import * as moment from 'moment';
import * as CodeMirror from 'codemirror';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css']
})
export class SubmissionsComponent implements OnInit, AfterViewInit {
  viewingJudgesSubmission: Submission;
  loadingSubmittedCodes = false;
  viewingSubmittedCodes: CodeFile[];
  viewingCodesSubmission: Submission;

  loadingSubmissions = false;
  hasLogin: boolean;

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

  @ViewChildren('codeArea') codeAreas: QueryList<any>;


  private static compareSubmissionsByTime(s1: Submission, s2: Submission): number {
    return s2.submissionTime - s1.submissionTime;
  }

  private static sortSubmissionsByTime(submissions: Submission[]): Submission[] {
    return submissions.sort(SubmissionsComponent.compareSubmissionsByTime);
  }

  ngOnInit() {
    this.studentService.authWithTokenToTryLogin().toPromise().then(hasLogin => this.hasLogin = hasLogin);

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
          .pipe(map(SubmissionsComponent.sortSubmissionsByTime))
      ));

      this.submissions$.subscribe(submissions => {
        this.submissions = SubmissionsComponent.sortSubmissionsByTime(submissions);
        this.loadingSubmissions = false;
      });
    }
  }

  get bestRecord(): Submission {
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
    return this.bestRecord && this.bestRecord.summaryStatus === status;
  }

  onViewSubmissionJudgesBtnClick(submission: Submission): boolean {
    this.viewingJudgesSubmission = submission;
    return true;  // propagate the click event to the bootstrap's modal
  }

  onViewSubmissionCodesBtnClick(submission: Submission): boolean {
    this.viewingCodesSubmission = submission;
    this.viewingSubmittedCodes = undefined;
    this.loadingSubmittedCodes = true;

    this.submissionService.getSubmittedCodes(this.problem.id, submission.id).toPromise()
      .then(submittedCodes => {
        this.loadingSubmittedCodes = false;
        this.viewingSubmittedCodes = submittedCodes;
        console.log(`Submitted codes downloaded.`);
      });

    return true;  // propagate the click event to the bootstrap's modal
  }


  describeTimeFromNow(time: number): string {
    return moment(time).fromNow();
  }

  isJudged(submission: Submission) {
    return isJudged(submission);
  }

  maximumMemory(submission: Submission) {
    return getMaximumMemory(submission);
  }

  maximumRuntime(submission: Submission) {
    return getMaximumRuntime(submission);
  }

  describeMemory(memoryInBytes: number): string {
    if (!memoryInBytes) {
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

  describeTimeInSeconds(ms: number) {
    if (!ms) {
      return '--';
    }
    return `${(ms / 1000).toFixed(2)} s`;
  }

  ngAfterViewInit() {
    // when the codeAreas' members changed, re-render them
    this.codeAreas.changes.subscribe(s => {
      this.renderCodeAreas();
    });
  }

  renderCodeAreas() {
    if (this.codeAreas.toArray().length > 0) {
      console.log('Rendering codes');
      for (const codeArea of this.codeAreas.toArray()) {
        const editor = CodeMirror.fromTextArea(codeArea.nativeElement, {
          lineNumbers: true,
          readOnly: 'noncursor',
          mode: 'text/x-csrc',  /* TODO set mode according to the language spec */
          theme: 'darcula'
        });
        // waiting 200 seconds to let the editor load the content, then refresh it
        setTimeout(() => editor.refresh(), 200);
      }
    }
  }


  describeGrade(totalGrade: number) {
    if (!totalGrade) {
      return '--';
    }
    return `${totalGrade} pt`;
  }
}
