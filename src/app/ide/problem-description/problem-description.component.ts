import {AfterViewInit, Component, ElementRef, OnDestroy, Renderer2, ViewChild} from '@angular/core';
import {Problem} from '../../models';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {initHighlight, parseMarkdown} from 'src/utils/markdownUtils';
import {ProblemContext} from '../../contexts/ProblemContext';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-problem-description',
  templateUrl: './problem-description.component.html',
  styleUrls: ['./problem-description.component.css', '../ide.share.css']
})
export class ProblemDescriptionComponent implements OnDestroy, AfterViewInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  public problem$: Observable<Problem>;

  constructor(private problemContext: ProblemContext,
              private route: ActivatedRoute,
              private renderer: Renderer2) {
    this.problem$ = this.problemContext.problem$;
  }

  @ViewChild('markdownPanel') markdownPanel: ElementRef;
  @ViewChild('problemDescriptionPanel') problemDescriptionPanel: ElementRef;
  @ViewChild('compilationScriptPanel') compilationScriptPanel: ElementRef;

  ngAfterViewInit(): void {
    initHighlight();
    this.problem$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(problem => this.onProblemInit(problem));
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  private onProblemInit(problem: Problem): Problem {
    this.renderMarkdown(problem);
    return problem;
  }

  private renderMarkdown(problem: Problem) {
    if (problem.description) {
      this.renderer.setProperty(this.markdownPanel.nativeElement, 'innerHTML',
        parseMarkdown(problem.description));
    }
    if (problem.compilation) {
      this.renderer.setProperty(this.compilationScriptPanel.nativeElement, 'innerHTML',
        parseMarkdown(`## Compilation \n\`\`\`sh\n${problem.compilation.script}\n\`\`\``));
    }
  }

}
