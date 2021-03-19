import {Component, OnInit} from '@angular/core';
import {MessageService} from 'primeng';
import {StudentService, SubmissionService} from './services/Services';
import {VerdictIssuedEvent, JudgeStatus, Submission} from './models';
import {CookieService} from './services/cookie/cookie.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  readonly MESSAGE_KEY_SUBMISSION_TOAST = 'submission-toast-key';

  isLoggedIn: boolean = false;

  constructor(private submissionService: SubmissionService,
              public studentService: StudentService,
              private cookieService: CookieService,
              private messageService: MessageService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.submissionService.verdictIssuedEventObservable.subscribe(
      (verdictIssuedEvent) => this.onVerdictIssued(verdictIssuedEvent));
    
    this.studentService.tryAuthWithCurrentToken().subscribe(e => this.isLoggedIn = e);
  }


  // TODO migrate to M2
  private onVerdictIssued(event: VerdictIssuedEvent) {
    this.messageService.add({
      key: this.MESSAGE_KEY_SUBMISSION_TOAST,
      severity: event.verdict.summaryStatus === JudgeStatus.AC ? 'success' : 'error',
      life: 8000,
      data: {
        judgeStatus: event.verdict.summaryStatus,
        problemTitle: event.problemTitle,
        problemId: event.problemId
      }
    });
  }

  onLogoutClick(): boolean {
    this.studentService.logout();
    return true; // propagate click event
  }
}
