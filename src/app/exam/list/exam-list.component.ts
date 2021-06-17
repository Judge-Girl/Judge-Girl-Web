import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import {ExamService, StudentService} from '../../../services/Services';
import {ExamItem} from '../../models';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';


@Component({
  selector: 'app-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['../../../animations.css', './exam-list.component.css']
})
export class ExamListComponent implements OnInit {
  examItems$: Observable<ExamItem[]>;

  constructor(private examService: ExamService,
              private studentService: StudentService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.examItems$ = this.studentService.loginStudent$.pipe(
      switchMap(student => this.examService.getExamsByStudentId(student.id)));
  }

  routeToExam(examId: number) {
    this.router.navigateByUrl(`exams/${examId}`);
  }

  getTimeString(date: Date) {
    return moment(date).format('YYYY/MM/DD h:mm A');
  }
}
