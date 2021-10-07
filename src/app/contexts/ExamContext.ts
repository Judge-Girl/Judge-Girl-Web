import {Answer, ExamOverview} from '../models';
import {Observable, Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {ExamService, StudentService} from '../../services/Services';
import {ResettableReplaySubject} from '../../utils/rx/my.subjects';
import {switchMap, takeUntil} from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
  }
)
export class ExamContext {
  private onDestroy$ = new Subject<void>();
  private examOverview$ = new ResettableReplaySubject<ExamOverview>(1);
  private examOverview?: ExamOverview;

  constructor(private examService: ExamService,
              private studentService: StudentService) {
  }

  public init(examId: number) {
    this.studentService.loginStudent$
      .pipe(takeUntil(this.onDestroy$),
        switchMap(student => this.examService.getExamProgressOverview(student.id, examId)))
      .subscribe({
        next: exam => this.initializeExam(exam),
        error: err => this.examNotFound(err)
      });
  }

  public destroy() {
    this.examOverview$.reset();
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

  get exam$(): Observable<ExamOverview> {
    return this.examOverview$;
  }
}

