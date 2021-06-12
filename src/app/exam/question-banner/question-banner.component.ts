import { Component, OnInit } from '@angular/core';
import { ExamOverview, Problem, Student } from '../../models';
import { ExamService, ProblemService, StudentService } from '../../services/Services';
import { ActivatedRoute, Router } from '@angular/router';
import { initHighlight } from 'src/utils/markdownUtils';

@Component({
  selector: 'question-banner',
  templateUrl: './question-banner.component.html',
  styleUrls: ['./question-banner.component.css'],
})
export class QuestionBanner implements OnInit {

  constructor(private problemService: ProblemService,
              private examService: ExamService,
              private studentService: StudentService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  examId: number;
  problemId: number;

  exam: ExamOverview;
  problem: Problem;

  updateExamProgressOverview(student: Student) {
    this.examService.getExamProgressOverview(student.id, this.examId).subscribe(exam => {
      this.exam = exam;
    });
  }

  ngOnInit(): void {
    initHighlight();

    this.examId = this.route.snapshot.params.examId;
    this.problemId = this.route.snapshot.params.problemId;

    const currentStudent = this.studentService.currentStudent;
    if (currentStudent) {
      this.updateExamProgressOverview(currentStudent);
    }

    this.studentService.currentStudent$.subscribe(student => {
      if (student) {
        this.updateExamProgressOverview(student);
      }
    })

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
