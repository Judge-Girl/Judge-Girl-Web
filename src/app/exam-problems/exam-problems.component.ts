import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { Exam } from '../models';
import { ExamService } from '../services/Services';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import * as MarkdownIt from 'markdown-it';
import MarkdownItKatex from 'markdown-it-katex';
import * as hljs from 'highlight.js';

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
    hljs.initHighlightingOnLoad();
    this.exam$ = this.route.parent.params.pipe(switchMap(params =>
      this.examService.getExam(+params.examId)
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
    const markdownIt = new MarkdownIt(
      {
        html: true,
        linkify: true,
        typographer: true,
        highlight(str, lang) {  // TODO: highlight currently not work
          const langModule = hljs.getLanguage(lang);
          if (lang && langModule) {
            try {
              const res = hljs.highlight(lang, str);
              console.log(`Render language ${lang} to markdown: ${res.value}`);
              return res.value;
            } catch (err) {
              console.log(err);
            }
          }
          return ''; // use external default escaping
        }
      }
    ).use(MarkdownItKatex);
    markdownIt.renderer.rules.table_open = () => {
      return '<table class="table">';
    };
    this.renderer.setProperty(element.nativeElement, 'innerHTML',
      markdownIt.render(mdString));
  }

  public getProblemOrder(i: number) {
    return String.fromCharCode(i + 65);
  }
  
  public getTotalScore() {
    return this.exam.problems.reduce((p, e) => p + e.score, 0);
  }

  public getTotalMaxScore() {
    return this.exam.problems.reduce((p, e) => p + e.maxScore, 0);
  }

  public routeToProblem(problemId: number) {
    this.router.navigateByUrl(`problems/${problemId}`);
  }
}
