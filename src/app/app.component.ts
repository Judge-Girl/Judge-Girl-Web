import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService} from 'primeng';
import {BrokerService} from '../services/Services';
import {JudgeStatus, VerdictIssuedEvent} from './models';
import {CookieService} from '../services/cookie/cookie.service';
import {Router} from '@angular/router';
import {EventBus, EventSubscriber} from '../services/EventBus';
import {Observable} from 'rxjs';
import {StudentContext} from './contexts/StudentContext';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends MessageService implements OnInit, OnDestroy, EventSubscriber {
  readonly MESSAGE_KEY_SUBMISSION_TOAST = 'submission-toast-key';

  hasLogin$: Observable<boolean>;
  hasLogin = false;

  constructor(public studentContext: StudentContext,
              private cookieService: CookieService,
              private messageService: MessageService,
              private brokerService: BrokerService,
              private eventBus: EventBus,
              private router: Router) {
    super();
    this.hasLogin$ = this.studentContext.hasLogin$;
  }

  ngOnInit() {
    this.eventBus.subscribe(this);
    this.studentContext.tryAuth();
    this.hasLogin$.subscribe(hasLogin => {
      this.hasLogin = hasLogin;
      if (hasLogin) {
        this.brokerService.connect();
      } else {
        this.brokerService.disconnect();
      }
    });
  }

  ngOnDestroy(): void {
    this.eventBus.unsubscribe(this);
  }

  onEvent(event: any) {
    // TODO: any strong-typed way to reference the event's name instead of referring to a raw string?
    if (event.type === 'VerdictIssuedEvent') {
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
  }

  onLogoutClick(): boolean {
    this.studentContext.logout();
    return true; // propagate click event
  }

  routeToChangePassword(): void {
    this.router.navigateByUrl('users/change-password');
  }

  routeToHome(): void {
    this.router.navigateByUrl('/');
  }
}
