import {Component, OnInit} from '@angular/core';
import {Submission, SubmissionService} from './services/impl/SubmissionService';
import {MessageService} from 'primeng';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {

  constructor(private submissionService: SubmissionService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.submissionService.judgeObservable.subscribe(this.onNextSubmissionJudged);
  }

  private onNextSubmissionJudged(submission: Submission) {
    this.messageService.add({
      severity: 'success', summary: ``, detail: ''
    });
  }
}
