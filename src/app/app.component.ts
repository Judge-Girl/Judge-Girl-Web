import {Component, OnInit} from '@angular/core';
import {MessageService} from 'primeng';
import {StudentService, SubmissionService} from './services/Services';
import {JudgeResponse, JudgeStatus, Submission} from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  readonly MESSAGE_KEY_SUBMISSION_TOAST = 'submission-toast-key';

  constructor(private submissionService: SubmissionService,
              private studentService: StudentService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.submissionService.judgeObservable.subscribe(
      (judgeResponse) => this.onNextJudgeResponse(judgeResponse));
  }

  private onNextJudgeResponse(judgeResponse: JudgeResponse) {
    this.messageService.add({
      key: this.MESSAGE_KEY_SUBMISSION_TOAST,
      severity: judgeResponse.submission.summaryStatus === JudgeStatus.AC ? 'success' : 'error',
      life: 8000,
      data: {
        judgeStatus: judgeResponse.submission.summaryStatus,
        problemTitle: judgeResponse.problemTitle,
        problemId: judgeResponse.problemId
      }
    });
  }

  onLogoutClick(): boolean {
    this.studentService.logout();
    return true; // propagate click event
  }
}
