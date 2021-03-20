import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import {ExamService, StudentService} from '../../services/Services';
import {ExamItem} from '../../models';
import {Router} from '@angular/router';


@Component({
  selector: 'app-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['../../../animations.css', './exam-list.component.css']
})
export class ExamListComponent implements OnInit {
  examItems: ExamItem[];
  loadingExams = false;

  constructor(private examService: ExamService,
              private studentService: StudentService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.examItems = [];
    this.loadingExams = true;
    this.studentService.tryAuthWithCurrentToken().subscribe(success => {
      if (!success) return this.router.navigateByUrl('/');

      this.examService.getExamsByStudentId(this.studentService.currentStudent.id)
        .subscribe(items => {
          this.loadingExams = false;
          this.examItems = items;
        });
    })
  }

  routeToExam(examId: number) {
    this.router.navigateByUrl(`exams/${examId}`);
  }

  getTimeString(date: Date) {
    return moment(date).format('YYYY/MM/DD h:mm A')
  }
}
