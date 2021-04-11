import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { ExamOverview } from '../../models';
import {ExamService, StudentService} from '../../services/Services';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-exam-scoreboard',
  templateUrl: './exam-scoreboard.component.html',
  styleUrls: ['./exam-scoreboard.component.css']
})
export class ExamScoreboardComponent implements OnInit, AfterViewInit {

  constructor(private examService: ExamService,
              private studentService: StudentService,
              private route: ActivatedRoute,
              private renderer: Renderer2) {
  }

  private exam$: Observable<ExamOverview>;

  exam: ExamOverview;

  ngOnInit(): void {
    this.exam$ = this.route.parent.params.pipe(switchMap(params =>
      this.examService.getExamProgressOverview(this.studentService.currentStudent.id, +params.examId)
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
