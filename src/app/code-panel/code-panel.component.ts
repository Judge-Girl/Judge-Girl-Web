import {Component, OnInit} from '@angular/core';
import {FileUpload, MessageService} from 'primeng';
import {LoginService, ProblemService} from '../services/Services';
import {SubmissionService} from '../services/impl/SubmissionService';
import {Problem} from '../models';
import {switchMap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-code-panel',
  templateUrl: './code-panel.component.html',
  styleUrls: ['./code-panel.component.css']
})
export class CodePanelComponent implements OnInit {
  readonly MESSAGE_KEY_ERROR_TOAST = 'error-toast-key';
  selectedFiles: File[];
  private problem$: Observable<Problem>;
  problem: Problem;


  constructor(private loginService: LoginService,
              private problemService: ProblemService,
              private submissionService: SubmissionService,
              private route: ActivatedRoute,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.selectedFiles = undefined;

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

  get hasLogin() {
    return this.loginService.hasLogin;
  }

  submit(): boolean {
    for (let i = 0; i < this.problem.submittedCodeSpecs.length; i++) {
      if (!this.selectedFiles[i]) {
        this.messageService.clear();
        this.messageService.add({
          key: this.MESSAGE_KEY_ERROR_TOAST,
          severity: 'error', summary: 'Error', detail: `The file  is not selected.`
        });
        return false;
      }
    }
    this.submissionService.submitFromFile(this.problem.id, this.selectedFiles);
    return false;
  }

  onFileSelectedCanceled(i: number, fileUpload: FileUpload) {
    this.selectedFiles[i] = undefined;
    fileUpload.clear();
  }
}
