import {Component, OnInit} from '@angular/core';
import dateFormat from 'dateformat';
import humanizeDuration from 'humanize-duration';
import {ExamService} from '../services/Services';
import {ExamItem} from '../models';
import {Router} from '@angular/router';


@Component({
  selector: 'app-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['../../animations.css', './exam-list.component.css']
})
export class ExamListComponent implements OnInit {
  examItems: ExamItem[];
  loadingExams = false;

  constructor(private examService: ExamService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.examItems = [];
    this.loadingExams = true;
    // TODO: get current student id
    this.examService.getExamsByStudentId(0)
      .subscribe(items => {
        this.loadingExams = false;
        this.examItems = items;
      });
  }

  routeToExam(examId: number) {
    this.router.navigateByUrl(`exam/${examId}`);
  }

  getTimeString(date: Date) {
    return dateFormat(date, "yyyy/mm/dd h:MM TT");
  }

  getDurationString(duration: number) {
    return humanizeDuration(duration, { units: ["m"], round: true });
  }
}
