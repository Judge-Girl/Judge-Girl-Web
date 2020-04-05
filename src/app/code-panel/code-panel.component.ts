import {Component, OnInit} from '@angular/core';
import * as CodeMirror from 'codemirror';
import {FileUpload} from 'primeng';
import {LoginService} from '../services/Services';

@Component({
  selector: 'app-code-panel',
  templateUrl: './code-panel.component.html',
  styleUrls: ['./code-panel.component.css']
})
export class CodePanelComponent implements OnInit {
  codeMirror: CodeMirror.EditorFromTextArea;
  private file: File;

  constructor(private loginService: LoginService) {
  }

  ngOnInit(): void {
    if (this.loginService.hasLogin) {
      const sourceCodeTextArea = document.getElementById('source-code-text-area') as HTMLTextAreaElement;
      this.codeMirror = CodeMirror.fromTextArea(sourceCodeTextArea, {
        lineNumbers: true,
        mode: 'text/x-csrc'
      });

      this.codeMirror.setSize(this.codeMirror.getWrapperElement().getBoundingClientRect().width, 550);
    }
  }

  onFileInputChange(fileInput: FileUpload) {
    const files = fileInput.files;
    this.file = files[0];
    console.log(`Upload file: ${this.file.name}`);
  }

  get hasLogin() {
    return this.loginService.hasLogin;
  }
}
