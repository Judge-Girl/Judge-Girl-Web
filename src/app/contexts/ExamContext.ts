import {ExamOverview} from '../models';
import {Observable, ReplaySubject} from 'rxjs';
import {Injectable} from '@angular/core';


@Injectable({
    providedIn: 'root'
  }
)
export class ExamContext {
  private examOverview$ = new ReplaySubject<ExamOverview>(1);
  private examOverview?: ExamOverview;

  onExamOverviewRetrieved(examOverview: ExamOverview) {
    this.examOverview = examOverview;
    this.examOverview$.next(this.examOverview);
  }

  onQuestionAnswered(problemId: number) {
    const filter = this.examOverview.questions.filter(q => q.problemId === problemId);
    if (filter.length === 0) {
      throw new Error(`The question with problemId=${problemId} isn't found in the current exam.`);
    }
    const question = filter[0];
    question.remainingQuota -= 1;

    this.examOverview$.next(this.examOverview);
  }

  get overview$(): Observable<ExamOverview> {
    return this.examOverview$;
  }

}
