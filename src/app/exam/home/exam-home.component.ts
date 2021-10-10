import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ExamOverview} from '../../models';
import {SplitComponent} from 'angular-split';
import {ExamContext} from '../../contexts/ExamContext';
import {Observable} from 'rxjs';

export enum Tab {
  PROBLEMS
}

@Component({
  selector: 'app-exam-home',
  templateUrl: './exam-home.component.html',
  styleUrls: ['./exam-home.component.css']
})
export class ExamHomeComponent implements AfterViewInit {

  readonly TAB_PROBLEMS = Tab.PROBLEMS;

  @ViewChild('problemsTab') problemsTab: ElementRef;
  @ViewChild('splitter') splitter: SplitComponent;
  private allTabs: ElementRef[];

  private examId: number;
  public exam$: Observable<ExamOverview>;

  constructor(private examContext: ExamContext,
              private router: Router, private route: ActivatedRoute) {
    this.examId = +route.snapshot.paramMap.get('examId');
    this.exam$ = this.examContext.exam$;
  }

  ngAfterViewInit(): void {
    this.allTabs = [this.problemsTab /* this.submissionsTab, this.scoreboardTab */];
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


