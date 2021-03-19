import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Problem} from '../models';
import {ProblemService} from '../services/Services';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { initHighlight, parseMarkdown } from 'src/utils/mardownUtils';

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
    initHighlight();
    this.problem$ = this.route.parent.params.pipe(switchMap(params =>
      this.problemService.getProblem(+params.problemId)
    ));
  }

  ngAfterViewInit(): void {
    // Use setTimeout(...) to run code asynchronously to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.problem$.subscribe(p => {
        this.problem = p;
        console.log(p);
        this.renderMarkdown();
      });
    });
  }

  private renderMarkdown() {
    this.renderer.setProperty(this.markdownPanel.nativeElement, 'innerHTML',
      parseMarkdown(this.problem.description));
    this.renderer.setProperty(this.compilationScriptPanel.nativeElement, 'innerHTML',
      parseMarkdown('## Compilation \n' +
        '```sh\n' +
        this.problem.compilation.script + '\n' +
        '```'));
  }
}
