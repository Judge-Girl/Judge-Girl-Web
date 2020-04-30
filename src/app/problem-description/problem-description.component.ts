import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Problem} from '../models';
import {ProblemService} from '../services/Services';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import * as MarkdownIt from 'markdown-it';
import MarkdownItKatex from 'markdown-it-katex';
import * as hljs from 'highlight.js';

@Component({
  selector: 'app-problem-description',
  templateUrl: './problem-description.component.html',
  styleUrls: ['./problem-description.component.css']
})
export class ProblemDescriptionComponent implements OnInit, AfterViewInit {

  constructor(private problemService: ProblemService,
              private route: ActivatedRoute,
              private renderer: Renderer2) {
  }

  private problem$: Observable<Problem>;

  problem: Problem;

  @ViewChild('markdownPanel') markdownPanel: ElementRef;
  @ViewChild('problemDescriptionPanel') problemDescriptionPanel: ElementRef;
  @ViewChild('compilationScriptPanel') compilationScriptPanel: ElementRef;

  ngOnInit(): void {
    this.problem$ = this.route.parent.params.pipe(switchMap(params =>
      this.problemService.getProblem(+params.problemId)
    ));
  }

  ngAfterViewInit(): void {
    // setTimeout(...) to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.problem$.subscribe(p => {
        this.problem = p;
        this.renderMarkdown();
      });
    });
  }

  private renderMarkdown() {
    const markdownIt = new MarkdownIt(
      {
        html: true,
        linkify: true,
        typographer: true,
        highlight(str, lang) {  // TODO not work
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(lang, str).value;
            } catch (__) {}
          }
          return ''; // use external default escaping
        }
      }
    ).use(MarkdownItKatex);
    markdownIt.renderer.rules.table_open = () => {
      return '<table class="table">';
    };
    this.renderer.setProperty(this.markdownPanel.nativeElement, 'innerHTML',
      markdownIt.render(this.problem.markdownDescription));
    this.renderer.setProperty(this.compilationScriptPanel.nativeElement, 'innerHTML',
      markdownIt.render('## Compilation \n' +
        '```shell\n' +
        this.problem.compilation.script + '\n' +
        '```'));
  }
}
