import {Answer, ExamOverview, getBetterRecord, toRecord} from '../models';
import {Observable, Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {BrokerMessage, BrokerService, ExamService, Unsubscribe} from '../../services/Services';
import {ResettableReplaySubject} from '../../utils/rx/my.subjects';
import {switchMap, takeUntil} from 'rxjs/operators';
import {StudentContext} from './StudentContext';

const SUBSCRIBER_NAME = 'ExamContext';

@Injectable({
    providedIn: 'root'
  }
)
export class ExamContext {
  private onDestroy$ = new Subject<void>();
  private examOverview$ = new ResettableReplaySubject<ExamOverview>(1);
  private examOverview?: ExamOverview;
  private unsubscriptions: Unsubscribe[] = [];

  constructor(private examService: ExamService,
              private studentContext: StudentContext,
              private brokerService: BrokerService) {
  }

  public init(examId: number) {
    this.studentContext.loginStudent$
      .pipe(takeUntil(this.onDestroy$),
        switchMap(student => this.examService.getExamProgressOverview(student.id, examId)))
      .subscribe({
        next: exam => this.initializeExam(exam),
        error: err => this.examNotFound(err)
      });

    const currentStudentSub = this.studentContext.loginStudent$.subscribe(student => {
      this.unsubscriptions.push(this.brokerService.subscribe(SUBSCRIBER_NAME,
        `/students/${student.id}/verdicts`, message => this.handleVerdictIssuedEventFromBrokerMessage(message)));
    });
    this.unsubscriptions.push(() => currentStudentSub.unsubscribe());
  }

  public destroy() {
    this.examOverview$.reset();
    this.unsubscriptions.forEach(unsubscribe => unsubscribe());
    this.onDestroy$.next();
  }

  private initializeExam(examOverview: ExamOverview) {
    this.examOverview = examOverview;
    this.examOverview$.next(this.examOverview);
  }

  examNotFound(err: Error) {
    this.examOverview$.error(err);
    this.examOverview$ = new ResettableReplaySubject<ExamOverview>(1);
  }

  answerQuestion(answer: Answer) {
    const {problemId} = answer;
    const filter = this.examOverview.questions.filter(q => q.problemId === problemId);
    if (filter.length === 0) {
      throw new Error(`The question with problemId=${problemId} isn't found in the current exam.`);
    }
    const question = filter[0];
    question.remainingQuota -= 1;

    this.examOverview$.next(this.examOverview);
  }

  private handleVerdictIssuedEventFromBrokerMessage(message: BrokerMessage) {
    const event = {...JSON.parse(message.body)};
    const record = toRecord(event.verdict);
    const filter = this.examOverview.questions.filter(q => q.problemId === event.problemId);
    if (filter.length === 0) {
      throw new Error(`The question with problemId=${event.problemId} isn't found in the current exam.`);
    }
    const question = filter[0];
    const betterRecord = getBetterRecord(question.bestRecord, record);
    question.bestRecord = betterRecord;
    question.yourScore = betterRecord.score;
  }

  get exam$(): Observable<ExamOverview> {
    return this.examOverview$;
  }
}

