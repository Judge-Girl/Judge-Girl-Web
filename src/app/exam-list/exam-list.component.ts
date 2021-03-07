import {Component, OnInit} from '@angular/core';
import {ExamService} from '../services/Services';
import {ExamItem} from '../models';
import {Router} from '@angular/router';
import {ExamTagDropDownComponent} from '../items/exam-tag-drop-down/exam-tag-drop-down.component';


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
    // Currently we do not support 'Pagination', therefore use the 0th page as default.
    this.examService.getExamItemsInPage(0)
      .subscribe(items => {
        this.loadingExams = false;
        this.examItems = items;
      });
  }

  routeToExam(examId: number) {
    this.router.navigateByUrl(`exams/${examId}`);
  }

  onExamTagSelected(examTag: string) {
    this.examItems = [];
    this.loadingExams = true;
    if (ExamTagDropDownComponent.ALL === examTag) {
      this.examService.getExamItemsInPage(0)
          .subscribe(items => {
            this.loadingExams = false;
            this.examItems = items;
          });
    } else {
      this.examService.getExamItemsByTag(examTag)
          .subscribe(items => {
            this.loadingExams = false;
            this.examItems = items;
          });
    }
  }
}
