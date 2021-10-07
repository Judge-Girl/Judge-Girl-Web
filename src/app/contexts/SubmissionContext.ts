import {Submission, VerdictIssuedEvent} from '../models';
import {Observable} from 'rxjs';
import {ResettableReplaySubject} from '../../utils/rx/my.subjects';
import {BrokerMessage, BrokerService, StudentService, SubmissionService, Unsubscribe} from '../../services/Services';
import {ProblemContext} from './ProblemContext';
import {switchMap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {EventBus} from '../../services/EventBus';

const SUBSCRIBER_NAME = 'SubmissionContext';

@Injectable({providedIn: 'root'})
export class SubmissionContext {
  private unsubscriptions: Unsubscribe[] = [];
  private submissions: Submission[];
  private submissionsSubject = new ResettableReplaySubject<Submission[]>();
  remainingSubmissionQuota$: Observable<number>;
  private submissionService: SubmissionService;

  public constructor(private problemContext: ProblemContext,
                     private studentService: StudentService,
                     private brokerService: BrokerService,
                     private eventBus: EventBus) {
  }

  public init(submissionService: SubmissionService) {
    this.submissionService = submissionService;
    this.subscribeToStudentSubmissions();
    const subscription = this.studentService.loginStudent$.pipe(
      switchMap(() => this.problemContext.problem$),
      switchMap(problem => this.submissionService.getSubmissions(problem.id)))
      .subscribe(submissions => this.onSubmissionsRetrieved(submissions));
    this.unsubscriptions.push(() => subscription.unsubscribe());
  }

  public destroy() {
    this.unsubscriptions.forEach(unsubscribe => unsubscribe());
    this.submissionsSubject.reset();
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

  get submissions$(): Observable<Submission[]> {
    return this.submissionsSubject;
  }
}
