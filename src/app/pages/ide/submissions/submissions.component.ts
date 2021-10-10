import {AfterViewInit, Component, Injector, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {SubmissionService} from '../../../services/Services';
import {map, takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {CodeFile, getBestRecord, hasRuntimeError, isRuntimeError, Judge, JudgeStatus, Submission} from '../../../models';
import * as CodeMirror from 'codemirror';
import {SubmissionContext} from '../../../contexts/SubmissionContext';
import {ActivatedRoute} from '@angular/router';
import {StudentContext} from '../../../contexts/StudentContext';


function compareSubmissionsByTime(s1: Submission, s2: Submission): number {
  return s2.submissionTime - s1.submissionTime;
}

function sortSubmissionsByTime(submissions: Submission[]): Submission[] {
  return submissions.sort(compareSubmissionsByTime);
}

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css', '../ide.share.css']
})
export class SubmissionsComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly onDestroy$ = new Subject<void>();

  submissionService: SubmissionService;
  viewingJudgesSubmission: Submission;
  viewingSubmittedCodes$: Observable<CodeFile[]>;
  viewingCodesSubmission: Submission;
  viewingReport: Map<string, any>;

  auth$: Observable<boolean>;
  submissions$: Observable<Submission[]>;
  bestRecord: Submission;

  AC = JudgeStatus.AC;
  CE = JudgeStatus.CE;
  TLE = JudgeStatus.TLE;
  MLE = JudgeStatus.MLE;
  WA = JudgeStatus.WA;
  RE = JudgeStatus.RE;
  SYSTEM_ERR = JudgeStatus.SYSTEM_ERR;
  NONE = JudgeStatus.NONE;
  @ViewChildren('codeArea') codeAreas: QueryList<any>;

  constructor(public studentContext: StudentContext,
              private submissionContext: SubmissionContext,
              private route: ActivatedRoute,
              injector: Injector) {
    this.auth$ = studentContext.awaitAuth$;
    this.submissionService = injector.get<SubmissionService>(route.parent.snapshot.data.submissionServiceProvider);

    this.submissions$ = submissionContext.submissions$
      .pipe(map(submissions => sortSubmissionsByTime(submissions)),
        map(submissions => this.onSubmissionsInit(submissions)));
  }

  private onSubmissionsInit(submissions: Submission[]): Submission[] {
    this.bestRecord = getBestRecord(submissions);
    return submissions;
  }

  ngOnInit() {
    this.submissionContext.init(this.submissionService);
  }

  ngAfterViewInit() {
    // when the codeAreas' members changed, re-render them
    this.codeAreas.changes
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.renderCodeAreas());
  }

  ngOnDestroy(): void {
    this.submissionContext.destroy();
    this.onDestroy$.next();
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
    this.viewingSubmittedCodes$ = this.submissionService.getSubmittedCodes(submission.problemId, submission.id,
      submission.submittedCodesFileId);
    this.viewingCodesSubmission = submission;
    return true;  // propagate the click event to the bootstrap's modal
  }

  hasRuntimeError(submission: Submission): boolean {
    return hasRuntimeError(submission);
  }

  isRuntimeErrorJudge(judge: Judge): boolean {
    return isRuntimeError(judge);
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
