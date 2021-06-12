import {AfterViewInit, Component, Injector, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProblemService, StudentService, SubmissionService} from '../services/Services';
import {map, switchMap} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {CodeFile, describeMemory, describeTimeInSeconds, Judge, JudgeStatus, Problem, Submission, TestCase} from '../models';
import * as moment from 'moment';
import * as CodeMirror from 'codemirror';

function getBestRecord(submissions: Submission[]) {
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

function compareSubmissionsByTime(s1: Submission, s2: Submission): number {
  return s2.submissionTime - s1.submissionTime;
}

function sortSubmissionsByTime(submissions: Submission[]): Submission[] {
  return submissions.sort(compareSubmissionsByTime);
}

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

  bestRecord: Submission;
  submissions$: Observable<Submission[]>;
  subscriptions: Subscription[] = [];
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

  ngOnInit() {
    this.fetchProblem();
    this.submissionService.onInit();

    this.subscriptions.push(
      this.tryAuthWithCurrentToken(() => {
        this.subscriptions.push(this.subscribeToCurrentSubmissions());
      }
      ));
  }

  ngOnDestroy(): void {
    this.submissionService.onDestroy();
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private fetchProblem() {
    this.problemService.getProblem(Number(this.route.parent.snapshot.params.problemId)).subscribe(p => {
      this.problem = p;
      this.problemService.getTestCases(this.problem.id).toPromise()
        .then(testCases => this.testCases = testCases);
    });
  }

  private subscribeToCurrentSubmissions(): Subscription {
    this.loadingSubmissions = true;
    this.submissions$ = this.route.parent.params.pipe(switchMap(params =>
      this.submissionService.getSubmissions(+params.problemId)
        .pipe(map(sortSubmissionsByTime))
    ));

    return this.submissions$.subscribe(submissions => {
      this.submissions = submissions;
      this.bestRecord = getBestRecord(submissions);
      this.loadingSubmissions = false;
    });
  }

  private tryAuthWithCurrentToken(onLogin: (Student) => void) {
    return this.studentService.tryAuthWithCurrentToken().subscribe(hasLogin => {
      this.hasLogin = hasLogin;
      if (this.studentService.hasLogin()) {
        onLogin(this.studentService.currentStudent);
      }
    });
  }

  hasSubmissions(): boolean {
    return this.submissions.length !== 0;
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

  isRuntimeErrorJudge(judge: Judge) {
    return judge?.status === this.RE;
  }

  isJudgeStatus(submission: Submission, status: JudgeStatus) {
    return submission?.verdict?.summaryStatus === status;
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
  getCCReport(): string {
    // return this.viewingReport.rawData.CodeQualityInspectionReport.CyclomaticComplexityReport.ccScore;
    return 'The Cyclomatic-Complexity Report hasn\'t been supported yet';
  }

  getCsaReport(): string {
    // return this.viewingReport.rawData.CodeQualityInspectionReport.CodingStyleAnalyzeReport.csaScore;
    return 'The Coding-Style Report hasn\'t been supported yet';
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
    this.subscriptions.push(
      this.codeAreas.changes.subscribe(s => {
        this.renderCodeAreas();
      }));
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
        // wait 200 seconds for loading the editor's content, and then refresh it
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
