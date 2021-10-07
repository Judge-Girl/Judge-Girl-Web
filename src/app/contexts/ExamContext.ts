import {Answer, ExamOverview} from '../models';
import {Observable, Subject} from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {RouteMatchingContext, RouterEvents} from './contexts';
import {ExamService, StudentService, SubmissionService} from '../../services/Services';
import {ResettableReplaySubject} from '../../utils/rx/my.subjects';
import {SubmissionContextPlugin} from './SubmissionContext';
import {switchMap, takeUntil} from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
  }
)
export class ExamContext extends RouteMatchingContext<number> {
  private onDestroy$ = new Subject<void>();
  private examOverview$ = new ResettableReplaySubject<ExamOverview>(1);
  private examOverview?: ExamOverview;

  constructor(protected router: RouterEvents,
              private examService: ExamService,
              private studentService: StudentService) {
    super(router);
    this.subscribeToRouterEvents();
  }

  matchAndExtractParams(url: string): number | undefined {
    const regex = url.match(/\/exams\/(\d+)/);
    return regex ? +regex[1] : undefined;
  }

  protected onEnterContext(examId: number) {
    this.studentService.loginStudent$
      .pipe(takeUntil(this.onDestroy$),
        switchMap(student => this.examService.getExamProgressOverview(student.id, examId)))
      .subscribe({
        next: exam => this.onExamOverviewRetrieved(exam),
        error: err => this.onExamNotFound(err)
      });
  }

  protected onLeaveContext() {
    this.onDestroy();
  }

  onExamOverviewRetrieved(examOverview: ExamOverview) {
    this.examOverview = examOverview;
    this.examOverview$.next(this.examOverview);
  }

  onExamNotFound(err: Error) {
    this.examOverview$.error(err);
    this.examOverview$ = new ResettableReplaySubject<ExamOverview>(1);
  }

  private onDestroy() {
    this.examOverview$.reset();
    this.onDestroy$.next();
  }

  onQuestionAnswered(answer: Answer) {
    const {problemId} = answer;
    const filter = this.examOverview.questions.filter(q => q.problemId === problemId);
    if (filter.length === 0) {
      throw new Error(`The question with problemId=${problemId} isn't found in the current exam.`);
    }
    const question = filter[0];
    question.remainingQuota -= 1;

    this.examOverview$.next(this.examOverview);
  }

  get exam$(): Observable<ExamOverview> {
    return this.examOverview$;
  }

  get exam(): ExamOverview | undefined {
    return this.examOverview;
  }
}


@Injectable({
  providedIn: 'root'
})
export class ExamSubmissionPlugin extends SubmissionContextPlugin {
  constructor(@Inject('EXAM_QUESTION_SUBMISSION_SERVICE') private examQuestionSubmissionService: SubmissionService) {
    super();
  }

  match(url: string): boolean {
    return !!url.match(/\/exams\/(\d+)\/problems\/(\d+)/);
  }

  onEnterContext(): void {
  }

  onLeaveContext(): void {
  }

  get submissionService(): SubmissionService {
    return this.examQuestionSubmissionService;
  }

}
