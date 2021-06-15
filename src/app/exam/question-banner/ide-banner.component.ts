import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ExamOverview, Problem, Student} from '../../models';
import {ExamService, ProblemService, StudentService} from '../../services/Services';
import {ActivatedRoute} from '@angular/router';
import {initHighlight} from 'src/utils/markdownUtils';

@Component({
  selector: 'app-ide-banner',
  templateUrl: './ide-banner.component.html',
  styleUrls: ['./ide-banner.component.css'],
})
export class IdeBannerComponent implements OnInit {
  @Input() h1: string;
  @Input() h2: string;
  @Input() previousPageName: string;
  @Output() goPreviousPage = new EventEmitter<void>();

  constructor(private problemService: ProblemService,
              private examService: ExamService,
              private studentService: StudentService,
              private route: ActivatedRoute) {
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
    });

    this.problemService.getProblem(this.problemId).subscribe(problem => {
      this.problem = problem;
    });
  }


}
