import {Component, OnInit} from '@angular/core';
import {MessageService} from 'primeng';
import {StudentService, SubmissionService} from './services/Services';
import {JudgeResponse, JudgeStatus, Submission} from './models';
import {CookieService} from './services/cookie/cookie.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  readonly MESSAGE_KEY_SUBMISSION_TOAST = 'submission-toast-key';

  constructor(private submissionService: SubmissionService,
              public studentService: StudentService,
              private cookieService: CookieService,
              private messageService: MessageService,
              private router: Router) {
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
