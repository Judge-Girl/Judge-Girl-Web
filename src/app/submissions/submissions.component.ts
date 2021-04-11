import {AfterViewInit, Component, Injector, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProblemService, StudentService, SubmissionService} from '../services/Services';
import {map, switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {
  CodeFile,
  describeMemory,
  describeTimeInSeconds,
  Judge,
  JudgeStatus,
  Problem,
  Submission,
  TestCase
} from '../models';
import * as moment from 'moment';
import * as CodeMirror from 'codemirror';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css']
})
export class SubmissionsComponent implements OnInit, OnDestroy, AfterViewInit {
  submissionService: SubmissionService;
  viewingJudgesSubmission: Submission;
  loadingSubmittedCodes = false;
  viewingSubmittedCodes: CodeFile[];
  viewingCodesSubmission: Submission;
  viewingReport: Map<string, any>;

  loadingSubmissions = false;
  hasLogin: boolean;

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
  SYSTEM_ERR = JudgeStatus.SYSTEM_ERR;
  NONE = JudgeStatus.NONE;
  @ViewChildren('codeArea') codeAreas: QueryList<any>;

  constructor(public studentService: StudentService,
              private problemService: ProblemService,
              private injector: Injector,
              private route: ActivatedRoute) {
    const submissionServiceInstanceName = route.parent.snapshot.data.submissionService;
    this.submissionService = injector.get<SubmissionService>(submissionServiceInstanceName);
  }


  private static compareSubmissionsByTime(s1: Submission, s2: Submission): number {
    return s2.submissionTime - s1.submissionTime;
  }

  private static sortSubmissionsByTime(submissions: Submission[]): Submission[] {
    return submissions.sort(SubmissionsComponent.compareSubmissionsByTime);
  }

  ngOnInit() {
    this.problem$ = this.route.parent.params.pipe(switchMap(params =>
      this.problemService.getProblem(+params.problemId)
    ));

    this.problem$.subscribe(p => {
      this.problem = p;
      this.problemService.getTestCases(this.problem.id).toPromise()
        .then(testCases => this.testCases = testCases);
    });

    this.studentService.tryAuthWithCurrentToken().subscribe(hasLogin => {
      this.hasLogin = hasLogin;
      if (this.studentService.hasLogin()) {
        this.loadingSubmissions = true;
        this.submissions$ = this.route.parent.params.pipe(switchMap(params =>
          this.submissionService.getSubmissions(+params.problemId)
            .pipe(map(SubmissionsComponent.sortSubmissionsByTime))
        ));

        this.submissions$.subscribe(submissions => {
          this.submissions = submissions;
          this.loadingSubmissions = false;
        });
      }
    });
  }

  ngOnDestroy(): void {
  }

  get bestRecord(): Submission {
    if (!this.submissions) {
      return undefined;
    }
    let bestGrade = -1;
    let best: Submission;
    for (const submission of this.submissions) {
      if (submission.judged &&
        submission.verdict.totalGrade > bestGrade) {
        bestGrade = submission.verdict.totalGrade;
        best = submission;
      }
    }
    return best;
  }

  ifTheBestSubmissionStatusIs(status: JudgeStatus) {
    return this.bestRecord && this.bestRecord.verdict.summaryStatus === status;
  }

  isRuntimeErrorJudge(judge: Judge) {
    return judge !== undefined && judge.status === this.RE;
  }

  hasRuntimeError(submission: Submission) {
    if (!submission) {
      return false;
    }
    for (const judge of submission.verdict.judges) {
      if (this.isRuntimeErrorJudge(judge)) {
        return true;
      }
    }
    return false;
  }

  isJudgeStatus(submission: Submission, status: JudgeStatus) {
    return submission && submission.verdict.summaryStatus === status;
  }

  onViewSubmissionJudgesBtnClick(submission: Submission): boolean {
    this.viewingJudgesSubmission = submission;
    return true;  // propagate the click event to the bootstrap's modal
  }

  onViewReportBtnClick(submission: Submission): boolean {
    this.viewingReport = submission.verdict.report;
    return true;  // propagate the click event to the bootstrap's modal
  }

  // TODO: drunk code, will be improved by #17
  getCCScore(): string {
    return this.viewingReport['rawData']['CodeQualityInspectionReport']['CyclomaticComplexityReport'].ccScore;
  }

  getCsaScore(): string {
    return this.viewingReport['rawData']['CodeQualityInspectionReport']['CodingStyleAnalyzeReport'].csaScore;
  }

  getGlobalVariables(): string {
    return this.viewingReport['rawData']['CodeQualityInspectionReport']['CodingStyleAnalyzeReport'].globalVariables;
  }

  onViewSubmissionCodesBtnClick(submission: Submission): boolean {
    this.viewingCodesSubmission = submission;
    this.viewingSubmittedCodes = undefined;
    this.loadingSubmittedCodes = true;

    this.submissionService.getSubmittedCodes(this.problem.id, submission.id,
      submission.submittedCodesFileId).toPromise()
      .then(submittedCodes => {
        this.loadingSubmittedCodes = false;
        this.viewingSubmittedCodes = submittedCodes;
      });

    return true;  // propagate the click event to the bootstrap's modal
  }

  describeTimeFromNow(time: number): string {
    return moment(time).fromNow();
  }

  describeMemory(memoryInBytes: number): string {
    return describeMemory(memoryInBytes);
  }

  describeTimeInSeconds(ms: number) {
    return describeTimeInSeconds(ms);
  }

  ngAfterViewInit() {
    // when the codeAreas' members changed, re-render them
    this.codeAreas.changes.subscribe(s => {
      this.renderCodeAreas();
    });
  }


  renderCodeAreas() {
    if (this.codeAreas.toArray().length > 0) {
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

  describeRuntimeErrorMessage(errorMessage: string) {
    if (errorMessage && errorMessage.length > 0) {
      return errorMessage;
    }
    return 'No error message, \nmaybe it\'s some kind of system error (e.g. Segmentation fault?)';
  }
}
