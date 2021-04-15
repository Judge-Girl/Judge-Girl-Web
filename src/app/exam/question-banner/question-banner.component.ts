import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { Exam, Problem, Question } from '../../models';
import { ExamService, ProblemService } from '../../services/Services';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { initHighlight, parseMarkdown } from 'src/utils/markdownUtils';

@Component({
  selector: 'question-banner',
  templateUrl: './question-banner.component.html',
  styleUrls: ['./question-banner.component.css']
})
export class QuestionBanner implements OnInit {

  constructor(private problemService: ProblemService,
              private examService: ExamService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  examId: number;
  problemId: number;

  exam: Exam;
  problem: Problem;

  ngOnInit(): void {
    initHighlight();

    this.examId = this.route.snapshot.params.examId;
    this.problemId = this.route.snapshot.params.problemId;

    this.examService.getExamOverview(this.examId).subscribe(exam => {
      this.exam = exam;
    });

    this.problemService.getProblem(this.problemId).subscribe(problem => {
      this.problem = problem;
    });
  }

  routeToExam() {
    this.router.navigateByUrl(`exams/${this.examId}`);
  }

  getProblemName() {
    return this.problem?.title || "";
  }

  getExamName() {
    return this.exam?.name || "";
  }
}
