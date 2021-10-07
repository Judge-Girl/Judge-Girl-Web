import {Component, Injector, OnDestroy, OnInit, ViewChildren} from '@angular/core';
import {FileUpload, MessageService} from 'primeng';
import {NoSubmissionQuota, StudentService, SubmissionService, SubmissionThrottlingError} from '../../../services/Services';
import {getCodeFileExtension, Problem, SubmittedCodeSpec} from '../../models';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {ProblemContext} from '../../contexts/ProblemContext';
import {SubmissionContext} from '../../contexts/SubmissionContext';
import {IdeCommands, IdePlugin} from '../ide.plugin';
import {map, startWith, takeUntil} from 'rxjs/operators';


export interface CodeUploadPanelDecorator {
  disableCodeUploadPanel?: { message?: string };
  submitCodeButtonDecoration?: { belowMessage?: string };
}

@Component({
  selector: 'app-code-upload-panel',
  templateUrl: './code-upload-panel.component.html',
  styleUrls: ['./code-upload-panel.component.css']
})
export class CodeUploadPanelComponent implements OnInit, OnDestroy {
  readonly MESSAGE_KEY_ERROR_TOAST = 'error-toast-key';
  private onDestroy$ = new Subject<void>();
  selectedFiles: File[];
  private problem$: Observable<Problem>;
  private remainingSubmissionQuota$: Observable<number>;
  decorator$: Observable<CodeUploadPanelDecorator>;
  problem: Problem;
  hasLogin: boolean;
  hasSelectedValidSubmittedCodes: boolean;
  submitting: boolean;

  @ViewChildren('fileInput') private fileUploads: FileUpload[];
  submissionService: SubmissionService;
  private readonly ideCommands: IdeCommands;

  constructor(public studentService: StudentService,
              private problemContext: ProblemContext,
              private submissionContext: SubmissionContext,
              private route: ActivatedRoute,
              private messageService: MessageService,
              private router: Router,
              injector: Injector) {
    const idePlugin = injector.get<IdePlugin>(route.snapshot.data.idePluginProvider);
    this.decorator$ = idePlugin.viewModel$.pipe(
      map(vm => vm.codeUploadPanelDecorator), startWith({}));
    this.ideCommands = idePlugin.commands(route.snapshot.params);
    this.problem$ = problemContext.problem$;
    this.remainingSubmissionQuota$ = submissionContext.remainingSubmissionQuota$;
    this.submissionService = injector.get<SubmissionService>(route.snapshot.data.submissionServiceProvider);
  }

  ngOnInit(): void {
    this.selectedFiles = undefined;
    this.studentService.hasLogin$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(hasLogin => this.hasLogin = hasLogin);

    this.problem$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(problem => {
          this.problem = problem;
          this.selectedFiles = new Array(problem.submittedCodeSpecs.length);
        }
      );
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  clearAndSelect(i: number, fileUpload: FileUpload) {
    if (this.selectedFiles[i]) {
      this.onFileSelectedCanceled(i, fileUpload);

      setTimeout(() => {
        const btn = document.getElementById('_fileSelector' + i);
        const inputs = btn.getElementsByTagName('input');
        inputs[0].click();
      }, 0);
    }
  }

  onFileClear() {
    this.hasSelectedValidSubmittedCodes = false;
  }

  onFileInputChange(index: number, codeSpecRow: HTMLDivElement, fileInput: FileUpload) {
    const files = fileInput.files;
    this.selectedFiles[index] = files[0];
    this.hasSelectedValidSubmittedCodes = this.allSpecifiedFilesSelected();
  }

  submit(): boolean {
    if (this.canSubmit()) {
      this.submitting = true;
      this.router.navigateByUrl(`${this.ideCommands.getTabRoutingPrefix()}problems/${this.problem.id}/submissions`,
        {replaceUrl: true});
      this.submissionService.submitFromFile(this.problem.id, this.problem.submittedCodeSpecs, this.selectedFiles)
        .toPromise().then((submission) => {
        this.submissionContext.onNewSubmission(submission);
        this.submitting = false;
      })
        .catch(err => {
          this.submitting = false;
          this.handleSubmitError(err);
        });
      return false;
    } else {
      if (!this.hasSelectedValidSubmittedCodes) {
        this.validateAllSpecifiedFileSelected();
      }
      return true;
    }
  }

  canSubmit(): boolean {
    return !this.submitting && this.hasSelectedValidSubmittedCodes;
  }

  private validateAllSpecifiedFileSelected(): void {
    for (let i = 0; i < this.problem.submittedCodeSpecs.length; i++) {
      if (!this.selectedFiles[i]) {
        this.messageService.clear();
        this.messageService.add({
          key: this.MESSAGE_KEY_ERROR_TOAST,
          severity: 'error', summary: 'Error', detail: `The file ${this.problem.submittedCodeSpecs[i].fileName} has not been selected.`
        });
      }
    }
  }

  private allSpecifiedFilesSelected(): boolean {
    for (let i = 0; i < this.problem.submittedCodeSpecs.length; i++) {
      if (!this.selectedFiles[i]) {
        return false;
      }
    }
    return true;
  }

  private handleSubmitError(err: Error) {
    if (err instanceof SubmissionThrottlingError) {
      this.messageService.add({
        key: this.MESSAGE_KEY_ERROR_TOAST,
        severity: 'warn', summary: 'Hold down...',
        detail: err.message
      });
    } else if (err instanceof NoSubmissionQuota) {
      this.messageService.add({
        key: this.MESSAGE_KEY_ERROR_TOAST,
        severity: 'warn', summary: 'Unfortunately...',
        detail: err.message
      });
    } else {
      this.messageService.add({
        key: this.MESSAGE_KEY_ERROR_TOAST,
        severity: 'error', summary: 'Error',
        detail: 'Unknown error, have your file contents been changed? Please re-upload them again.'
      });
      this.clearAllFileUploads();
      throw err;  // hence we don't expect such errors, throw it to debug
    }
  }

  private clearAllFileUploads() {
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.selectedFiles[i] = undefined;
    }
    this.fileUploads.forEach(f => f.clear());
  }

  onFileSelectedCanceled(i: number, fileUpload: FileUpload) {
    this.selectedFiles[i] = undefined;
    fileUpload.clear();
  }

  getAcceptedFileExtensionByCodeSpec(codeSpec: SubmittedCodeSpec): string {
    return getCodeFileExtension(codeSpec);
  }

}
