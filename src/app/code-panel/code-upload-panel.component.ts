import {Component, OnInit, ViewChildren} from '@angular/core';
import {FileUpload, MessageService} from 'primeng';
import {ProblemService, StudentService, SubmissionService, SubmissionThrottlingError} from '../services/Services';
import {Problem, SubmittedCodeSpec} from '../models';
import {switchMap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-code-upload-panel',
  templateUrl: './code-upload-panel.component.html',
  styleUrls: ['./code-upload-panel.component.css']
})
export class CodeUploadPanelComponent implements OnInit {
  readonly MESSAGE_KEY_ERROR_TOAST = 'error-toast-key';
  selectedFiles: File[];
  private problem$: Observable<Problem>;
  problem: Problem;
  hasLogin: boolean;

  @ViewChildren('fileInput') private fileUploads: FileUpload[];


  constructor(public studentService: StudentService,
              private problemService: ProblemService,
              private submissionService: SubmissionService,
              private route: ActivatedRoute,
              private messageService: MessageService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.selectedFiles = undefined;
    this.studentService.tryAuthWithCurrentToken().toPromise().then(hasLogin => this.hasLogin = hasLogin);

    // TODO understand why route.parent is not needed
    this.problem$ = this.route.params.pipe(switchMap(params =>
      this.problemService.getProblem(+params.problemId)
    ));
    this.problem$.subscribe(p => {
      this.problem = p;
      this.selectedFiles = new Array(p.submittedCodeSpecs.length);
    });
  }

  onFileInputChange(index: number, codeSpecRow: HTMLDivElement, fileInput: FileUpload) {
    const files = fileInput.files;
    this.selectedFiles[index] = files[0];
    console.log(`File selected: ${this.selectedFiles[index].name}`);
  }

  submit(): boolean {
    if (this.validateAllSpecifiedFileSelected()) {
      this.router.navigateByUrl(`/problems/${this.problem.id}/submissions`);
      this.submissionService.submitFromFile(this.problem.id, this.selectedFiles)
        .toPromise().then(submission => {
        console.log(`Submit successfully, ${submission}`);
      }).catch(err => this.handleSubmitError(err));
    }
    return false;
  }

  private validateAllSpecifiedFileSelected(): boolean {
    for (let i = 0; i < this.problem.submittedCodeSpecs.length; i++) {
      if (!this.selectedFiles[i]) {
        this.messageService.clear();
        this.messageService.add({
          key: this.MESSAGE_KEY_ERROR_TOAST,
          severity: 'error', summary: 'Error', detail: `The file ${this.problem.submittedCodeSpecs[i].fileName} has not been selected.`
        });
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
    } else {
      this.messageService.add({
        key: this.MESSAGE_KEY_ERROR_TOAST,
        severity: 'error', summary: 'Error',
        detail: 'Unknown error, have you file contents been changed? Please re-upload them again.'
      });
      this.clearAllFileUploads();
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
    const lang = codeSpec.language.toLowerCase();
    switch (lang) {
      case 'c':
        return '.c';
      case 'java':
        return '.java';
      case 'open_cl':
        return '.cl';
      default:
        throw new Error(`The language not supported, given ${lang}`);
    }
  }
}
