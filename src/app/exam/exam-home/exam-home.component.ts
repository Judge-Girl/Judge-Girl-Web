import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {ExamService, StudentService} from '../../services/Services';
import {ExamOverview} from '../../models';
import {SplitComponent} from 'angular-split';
import {ExamContext} from '../../contexts/ExamContext';
import {Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

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
  private allTabs: ElementRef[];

  private examId$: Observable<number>;
  public isLoading: boolean;
  public examOverview$: Observable<ExamOverview>;

  constructor(private elementRef: ElementRef,
              private studentService: StudentService,
              private examContext: ExamContext,
              private examService: ExamService,
              private router: Router, private route: ActivatedRoute) {
    this.examId$ = this.route.paramMap.pipe(map(params => +params.get('examId')));
    this.examOverview$ = this.examContext.overview$;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.examOverview$.toPromise().then(() => this.isLoading = false);

    if (this.studentService.authenticate()) {
      this.examId$.pipe(switchMap(examId =>
        this.examService.getExamProgressOverview(this.studentService.currentStudent.id, examId)))
        .subscribe(examOverview => this.examContext.onExamOverviewRetrieved(examOverview));
    }
  }

  ngAfterViewInit(): void {
    this.allTabs = [this.problemsTab /*, this.submissionsTab, this.scoreboardTab */];
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.refreshTabElementsState();
      }
    });
    this.routeToTabByCurrentUrl();
    this.refreshTabElementsState();
  }


  routeToTab(tab: Tab): void {
    if (tab === Tab.PROBLEMS) {
      this.examId$.subscribe(examId => this.router.navigate([`exams/${examId}`]));
    }
  }

  private refreshTabElementsState() {
      this.activateTabAndDeactivateOthers(this.problemsTab);
  }

  private activateTabAndDeactivateOthers(tab: ElementRef) {
    if (this.allTabs) {
      for (const t of this.allTabs) {
        if (t === tab) {
          t.nativeElement.classList.add('my-item-active');
        } else {
          t.nativeElement.classList.remove('my-item-active');
        }
      }
    }
  }

  private routeToTabByCurrentUrl() {
      this.routeToTab(Tab.PROBLEMS);
  }

  routeToExamList() {
    this.router.navigateByUrl('/exams');
  }

  routeToCurrentExamIndex() {
    this.examOverview$.toPromise()
      .then(exam => {
        this.router.navigateByUrl(`/exams/${exam.id}`);
        this.refreshTabElementsState();
      });
  }
}


