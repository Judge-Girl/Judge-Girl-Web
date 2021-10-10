import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';

import {describeMemory, describeTimeInSeconds, ExamOverview, JudgeStatus, Question} from '../../../../../models';
import {ActivatedRoute, Router} from '@angular/router';
import {initHighlight, parseMarkdown} from 'src/app/commons/utils/markdownUtils';
import {ExamContext} from '../../../../../contexts/ExamContext';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-exam-problems',
  templateUrl: './exam-questions.component.html',
  styleUrls: ['./exam-questions.component.css']
})
export class ExamQuestionsComponent implements OnInit {

  constructor(private examContext: ExamContext,
              private route: ActivatedRoute,
              private router: Router) {
  }

  private examId: number;
  public exam$: Observable<ExamOverview>;
  public questions$: Observable<Question[]>;
  public totalScore$: Observable<number>;
  public totalMaxScore$: Observable<number>;


  ngOnInit(): void {
    this.examId = Number(this.route.parent.snapshot.params.examId);
    this.exam$ = this.examContext.exam$;
    this.questions$ = this.exam$.pipe(map(exam => exam.questions));
    this.totalScore$ = this.questions$.pipe(
      map(questions => questions.reduce((p, e) => p + e.yourScore, 0)));
    this.totalMaxScore$ = this.questions$.pipe(
      map(questions => questions.reduce((p, e) => p + e.maxScore, 0)));
    initHighlight();
  }

  public toCharacterIndex(i: number) {
    return String.fromCharCode(i + 65);
  }

  public routeToQuestion(question: Question) {
    this.router.navigateByUrl(`exams/${this.examId}/problems/${question.problemId}`);
  }

  describeQuestionStatus(question: Question): string {
    return question.bestRecord ? question.bestRecord.status : '';
  }

  describeQuestionBestRecord(question: Question): string {
    const bestRecord = question.bestRecord;
    if (!bestRecord) {
      return '--';
    }
    if (bestRecord.status === JudgeStatus.AC) {
      return `(${describeTimeInSeconds(bestRecord.maximumRuntime)}, ${describeMemory(bestRecord.maximumMemoryUsage)})`;
    }
    return `(score: ${bestRecord.score})`;
  }
}
