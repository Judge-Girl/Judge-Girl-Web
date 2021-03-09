import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { Exam } from '../models';
import { ExamService } from '../services/Services';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-exam-problems',
  templateUrl: './exam-problems.component.html',
  styleUrls: ['./exam-problems.component.css']
})
export class ExamProblemsComponent implements OnInit, AfterViewInit {

  constructor(private examService: ExamService,
              private route: ActivatedRoute,
              private renderer: Renderer2) {
  }

  private exam$: Observable<Exam>;

  exam: Exam;

  ngOnInit(): void {
    this.exam$ = this.route.parent.params.pipe(switchMap(params =>
      this.examService.getExam(+params.examId)
    ));
  }

  ngAfterViewInit(): void {
    // Use setTimeout(...) to run code asynchronously to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.exam$.subscribe(e => {
        this.exam = e;
      });
    });
  }
}
