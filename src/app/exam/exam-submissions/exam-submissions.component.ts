import {AfterViewInit, Component, OnInit, Renderer2} from '@angular/core';
import { ExamOverview } from '../../models';
import {ExamService, StudentService} from '../../services/Services';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-exam-submissions',
  templateUrl: './exam-submissions.component.html',
  styleUrls: ['./exam-submissions.component.css']
})
export class ExamSubmissionsComponent implements OnInit, AfterViewInit {

  constructor(private examService: ExamService,
              private studentService: StudentService,
              private route: ActivatedRoute) {
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
