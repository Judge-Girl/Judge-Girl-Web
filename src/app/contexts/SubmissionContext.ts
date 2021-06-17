import {RouteMatchingContext, RouterEvents} from './contexts';
import {Submission, VerdictIssuedEvent} from '../models';
import {Observable} from 'rxjs';
import {ResettableReplaySubject} from '../../utils/rx/my.subjects';
import {BrokerMessage, BrokerService, StudentService, SubmissionService, Unsubscribe} from '../../services/Services';
import {ProblemContext} from './ProblemContext';
import {switchMap} from 'rxjs/operators';
import {Inject, Injectable} from '@angular/core';
import {EventBus} from '../../services/EventBus';
import {SUBMISSION_CONTEXT_PLUGINS_PROVIDERS_TOKEN} from '../providers.token';

const SUBSCRIBER_NAME = 'SubmissionContext';

export abstract class SubmissionContextPlugin {
  isActive = false;

  abstract match(url: string): boolean;

  abstract onEnterContext(): void;

  abstract get submissionService(): SubmissionService;

  abstract onLeaveContext(): void;
}

@Injectable({providedIn: 'root'})
export class SubmissionContext extends RouteMatchingContext<boolean> {
  private unsubscriptions: Unsubscribe[] = [];
  private submissions: Submission[];
  private submissionsSubject = new ResettableReplaySubject<Submission[]>();
  remainingSubmissionQuota$: Observable<number>;

  public constructor(protected router: RouterEvents,
                     private problemContext: ProblemContext,
                     @Inject(SUBMISSION_CONTEXT_PLUGINS_PROVIDERS_TOKEN) private plugins: SubmissionContextPlugin[],
                     private studentService: StudentService,
                     private brokerService: BrokerService,
                     private eventBus: EventBus) {
    super(router);
    this.subscribeToRouterEvents();
  }

  matchAndExtractParams(url: string): boolean {
    let active = false;
    for (const plugin of this.plugins) {
      plugin.isActive = plugin.match(url);
      if (plugin.isActive) {
        active = true;
      }
    }
    return active;
  }

  protected onEnterContext() {
    this.subscribeToStudentSubmissions();
    const subscription = this.studentService.loginStudent$.pipe(
      switchMap(() => this.problemContext.problem$),
      switchMap(problem => this.submissionService.getSubmissions(problem.id)))
      .subscribe(submissions => this.onSubmissionsRetrieved(submissions));
    this.unsubscriptions.push(() => subscription.unsubscribe());
  }

  get submissionService(): SubmissionService {
    return this.plugins.find(plugin => plugin.isActive).submissionService;
  }

  private subscribeToStudentSubmissions() {
    const currentStudentSub = this.studentService.loginStudent$.subscribe(student => {
      this.unsubscriptions.push(this.brokerService.subscribe(SUBSCRIBER_NAME,
        `/students/${student.id}/verdicts`, message => this.handleVerdictIssuedEventFromBrokerMessage(message)));
    });
    this.unsubscriptions.push(() => currentStudentSub.unsubscribe());
  }

  private handleVerdictIssuedEventFromBrokerMessage(message: BrokerMessage) {
    const obj = JSON.parse(message.body);
    const event = new VerdictIssuedEvent(obj.problemId, obj.studentId, obj.problemTitle, obj.submissionId, obj.verdict);
    this.onVerdictIssued(event);
  }

  protected onLeaveContext() {
    this.onDestroy();
  }

  onSubmissionsRetrieved(submissions: Submission[]) {
    this.submissions = submissions;
    this.submissionsSubject.next(this.submissions);
  }

  onNewSubmission(submission: Submission) {
    this.pushInNotDuplicate(submission);
    this.submissionsSubject.next(this.submissions);
  }

  private pushInNotDuplicate(submission: Submission) {
    for (const s of this.submissions) {
      if (s.id === submission.id) {
        return;
      }
    }
    this.submissions.push(submission);
  }

  onVerdictIssued(event: VerdictIssuedEvent) {
    this.eventBus.publish(event);
    this.submissions.filter(submission => submission.id === event.submissionId)
      .forEach(submission => {
        submission.verdict = event.verdict;
        submission.judged = true;
      });
    this.submissionsSubject.next(this.submissions);
  }

  onDestroy() {
    this.unsubscriptions.forEach(unsubscribe => unsubscribe());
    this.submissionsSubject.reset();
  }

  get submissions$(): Observable<Submission[]> {
    return this.submissionsSubject;
  }
}

@Injectable({
  providedIn: 'root'
})
export class NormalSubmissionPlugin extends SubmissionContextPlugin {
  constructor(@Inject('NORMAL_SUBMISSION_SERVICE') private normalSubmissionService: SubmissionService) {
    super();
  }

  match(url: string): boolean {
    return !!url.match(/\/problems\/(\d+)/);
  }

  onEnterContext(): void {
  }

  onLeaveContext(): void {
  }

  get submissionService(): SubmissionService {
    return this.normalSubmissionService;
  }

}
