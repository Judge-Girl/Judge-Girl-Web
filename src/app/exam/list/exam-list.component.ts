import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import {ExamService, StudentService} from '../../../services/Services';
import {ExamItem, ExamStatus, getExamStatus} from '../../models';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';


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
      switchMap(student => this.examService.getExamsByStudentId(student.id)),
      map(exams => this.sortExamsByStatus(exams)));
  }

  sortExamsByStatus(exams: ExamItem[]): ExamItem[] {
    const rank = {};
    rank[ExamStatus.ONGOING] = 2;
    rank[ExamStatus.UPCOMING] = 1;
    rank[ExamStatus.CLOSED] = 0;

    return exams.sort((e1, e2) => {
      const s1 = getExamStatus(e1);
      const s2 = getExamStatus(e2);
      return rank[s2] - rank[s1];
    });
  }

  routeToExam(exam: ExamItem) {
    if (getExamStatus(exam) !== ExamStatus.UPCOMING) {
      this.router.navigateByUrl(`exams/${exam.id}`);
    }
  }

  getTimeString(date: number) {
    return moment(date).format('YYYY/MM/DD h:mm A');
  }

  examStyle(exam: ExamItem) {
    const examStatus = getExamStatus(exam);
    switch (examStatus) {
      case ExamStatus.UPCOMING:
        return 'upcoming';
      case ExamStatus.CLOSED:
        return 'closed';
      case ExamStatus.ONGOING:
        return 'ongoing';
    }
  }

  describeExamStatus(exam: ExamItem) {
    const examStatus = getExamStatus(exam);
    switch (examStatus) {
      case ExamStatus.UPCOMING:
        return 'Upcoming';
      case ExamStatus.CLOSED:
        return 'Closed';
      case ExamStatus.ONGOING:
        return 'Ongoing';
    }
  }

  isUpcoming(exam: ExamItem) {
    return getExamStatus(exam) === ExamStatus.UPCOMING;
  }
}
