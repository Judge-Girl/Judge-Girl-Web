import {Component, OnDestroy, OnInit} from '@angular/core';
import {ExamContext} from '../../../contexts/ExamContext';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-exam-root-component',
  template: '<router-outlet></router-outlet>',
})
export class ExamRootComponent implements OnInit, OnDestroy {
  private readonly examId: number;

  constructor(private route: ActivatedRoute,
              private examContext: ExamContext) {
    this.examId = +this.route.snapshot.paramMap.get('examId');
  }

  ngOnInit(): void {
    this.examContext.init(this.examId);
  }

  ngOnDestroy(): void {
    this.examContext.destroy();
  }
}
