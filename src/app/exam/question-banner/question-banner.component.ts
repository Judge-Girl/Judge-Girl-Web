import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { Exam, Question } from '../../models';
import { ExamService } from '../../services/Services';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { initHighlight, parseMarkdown } from 'src/utils/markdownUtils';

@Component({
  selector: 'question-banner',
  templateUrl: './question-banner.component.html',
  styleUrls: ['./question-banner.component.css']
})
export class QuestionBanner implements OnInit, AfterViewInit {

  constructor(private examService: ExamService,
              private route: ActivatedRoute,
              private router: Router,
              private renderer: Renderer2) {
  }

  examId: number;
  problemId: number;

  ngOnInit(): void {
    initHighlight();
    this.route.parent.params.subscribe(params => {
      this.examId = Number(params.examId);
      this.problemId = Number(params.problemId);
    })
  }

  ngAfterViewInit(): void {
    // Use setTimeout(...) to run code asynchronously to avoid ExpressionChangedAfterItHasBeenCheckedError
    // setTimeout(() => {
    //   this.exam$.subscribe(e => {
    //     this.exam = e;
    //   });
    // });
  }
}
