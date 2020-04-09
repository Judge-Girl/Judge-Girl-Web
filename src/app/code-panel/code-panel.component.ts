import {Component, OnInit} from '@angular/core';
import * as CodeMirror from 'codemirror';
import {FileUpload} from 'primeng';
import {LoginService, ProblemService} from '../services/Services';
import {SubmissionService} from '../services/impl/SubmissionService';

@Component({
  selector: 'app-code-panel',
  templateUrl: './code-panel.component.html',
  styleUrls: ['./code-panel.component.css']
})
export class CodePanelComponent implements OnInit {
  codeMirror: CodeMirror.EditorFromTextArea;
  private file: File;
  private sourceCodeTextArea: HTMLTextAreaElement;

  constructor(private loginService: LoginService,
              private problemService: ProblemService,
              private submissionService: SubmissionService) {
  }

  ngOnInit(): void {
    this.file = undefined;
    if (this.loginService.hasLogin) {
      this.sourceCodeTextArea = document.getElementById('source-code-text-area') as HTMLTextAreaElement;
      this.codeMirror = CodeMirror.fromTextArea(this.sourceCodeTextArea, {
        lineNumbers: true,
        mode: 'text/x-csrc'
      });

      this.codeMirror.setSize(this.codeMirror.getWrapperElement().getBoundingClientRect().width, 550);
    }
  }

  onFileInputChange(fileInput: FileUpload) {
    const files = fileInput.files;
    this.file = files[0];
    console.log(`File uploaded: ${this.file.name}`);
  }

  get hasLogin() {
    return this.loginService.hasLogin;
  }

  submit(): boolean {
    if (this.file) {
      console.log(`Submitting file: ${this.file.name}`);
      this.submissionService.submitFromFile(this.problemService.currentProblemId, this.file);
    } else {
      console.log(`Submitting source code... `);
      this.submissionService.submitSourceCode(this.problemService.currentProblemId, this.sourceCodeTextArea.value);
    }

    return false;
  }
}
