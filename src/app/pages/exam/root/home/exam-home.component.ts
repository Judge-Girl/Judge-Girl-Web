import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ExamOverview} from '../../../../models';
import {SplitComponent} from 'angular-split';
import {ExamContext} from '../../../../contexts/ExamContext';
import {Observable} from 'rxjs';
import {parseMarkdown} from '../../../../commons/utils/markdownUtils';
import {map} from 'rxjs/operators';

export enum Tab {
  PROBLEMS
}

@Component({
  selector: 'app-exam-home',
  templateUrl: './exam-home.component.html',
  styleUrls: ['./exam-home.component.css']
})
export class ExamHomeComponent implements OnInit, AfterViewInit {

  readonly TAB_PROBLEMS = Tab.PROBLEMS;

  @ViewChild('problemsTab') problemsTab: ElementRef;
  @ViewChild('splitter') splitter: SplitComponent;
  @ViewChild('examDescriptionPanel') examDescriptionPanel?: ElementRef;
  private allTabs: ElementRef[];

  private examId: number;
  public exam$: Observable<ExamOverview>;

  constructor(private examContext: ExamContext,
              private renderer: Renderer2,
              private router: Router, private route: ActivatedRoute) {
    this.examId = +route.snapshot.paramMap.get('examId');
  }

  ngOnInit(): void {
    this.exam$ = this.examContext.exam$.pipe(map(exam => this.onExamInit(exam)));
  }

  private onExamInit(exam: ExamOverview): ExamOverview {
    this.renderMarkdown(exam.description);
    return exam;
  }

  private renderMarkdown(mdString: string) {
    if (this.examDescriptionPanel) {
      this.renderer.setProperty(this.examDescriptionPanel.nativeElement, 'innerHTML',
        parseMarkdown(mdString));
    } else {
      // If 'examDescriptionPanel' has not been init, retry it after a while.
      setTimeout(() => this.renderMarkdown(mdString), 400);
    }
  }

  ngAfterViewInit(): void {
    this.allTabs = [this.problemsTab];
    this.activateTabAndDeactivateOthers(this.problemsTab);
  }

  routeToTab(tab: Tab): void {
    if (tab === Tab.PROBLEMS) {
      this.router.navigate([`exams/${this.examId}`]);
    }
  }

  private activateTabAndDeactivateOthers(tab: ElementRef) {
    if (this.allTabs) {
      for (const t of this.allTabs) {
        if (t === tab) {
          t.nativeElement?.classList?.add('my-item-active');
        } else {
          t.nativeElement?.classList?.remove('my-item-active');
        }
      }
    }
  }

  routeToExamList() {
    this.router.navigateByUrl('/exams');
  }

  routeToCurrentExamHome() {
    this.router.navigateByUrl(`/exams/${this.examId}`);
  }

  notFoundGoBack() {
    this.router.navigateByUrl(`/exams`, {replaceUrl: true});
  }
}


