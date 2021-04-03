import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { Exam } from '../../models';
import { ExamService } from '../../services/Services';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { initHighlight, parseMarkdown } from 'src/utils/markdownUtils';

@Component({
  selector: 'app-exam-problems',
  templateUrl: './exam-problems.component.html',
  styleUrls: ['./exam-problems.component.css']
})
export class ExamProblemsComponent implements OnInit, AfterViewInit {

  constructor(private examService: ExamService,
              private route: ActivatedRoute,
              private router: Router,
              private renderer: Renderer2) {
  }

  private exam$: Observable<Exam>;
  public exam: Exam;

  @ViewChild('examDescriptionPanel') set content(content: ElementRef) {
    if (content) {
      this.renderMarkdown(content, this.exam.description);
    }
  }

  ngOnInit(): void {
    initHighlight();
    this.exam$ = this.route.parent.params.pipe(switchMap(params =>
      this.examService.getExamOverview(+params.examId)
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

  private renderMarkdown(element: ElementRef, mdString: string) {
    this.renderer.setProperty(element.nativeElement, 'innerHTML',
      parseMarkdown(mdString));
  }

  public getProblemOrderChar(i: number) {
    return String.fromCharCode(i + 65);
  }

  public getTotalScore() {
    return this.exam.questions.reduce((p, e) => p + e.score, 0);
  }

  public getTotalMaxScore() {
    return this.exam.questions.reduce((p, e) => p + e.maxScore, 0);
  }

  public routeToProblem(problemId: number) {
    this.router.navigateByUrl(`exams/${this.exam.id}/problems/${problemId}`);
  }
}
