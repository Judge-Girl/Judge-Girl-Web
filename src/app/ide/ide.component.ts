import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import {ProblemService, StudentService} from '../services/Services';
import {SplitComponent} from 'angular-split';
import {ProblemContext} from '../contexts/ProblemContext';
import {takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {Problem} from '../models';
import {IdePluginChain} from './ide.plugin';

export enum Tab {
  TESTCASES,
  PROBLEM, SUBMISSIONS
}

export interface Banner {
  header1: string;
  header2: string;
  previousPageName: string;
  navigatePreviousPage(): void;
}

@Component({
  selector: 'app-multi-tabs-panel',
  templateUrl: './ide.component.html',
  styleUrls: ['./ide.component.css']
})
export class IdeComponent implements OnInit, OnDestroy, AfterViewInit {
  private onDestroy$: Subject<void> = new Subject<void>();

  private routePrefixing: (routeParams: Params) => string;
  readonly TAB_SUBMISSIONS = Tab.SUBMISSIONS;
  readonly TAB_PROBLEM = Tab.PROBLEM;

  readonly TAB_TESTCASES = Tab.TESTCASES;
  @ViewChild('problemTab') problemTab: ElementRef;
  @ViewChild('testcasesTab') testcasesTab: ElementRef;
  @ViewChild('submissionsTab') submissionsTab: ElementRef;
  @ViewChild('splitter') splitter: SplitComponent;
  private allTabs: ElementRef[];
  private readonly routeParams: Params;
  private readonly problemId: number;
  banner$?: Observable<Banner>;
  problem$: Observable<Problem>;

  constructor(private elementRef: ElementRef,
              private problemContext: ProblemContext,
              private problemService: ProblemService,
              public studentService: StudentService,
              private idePlugin: IdePluginChain,
              private router: Router, private route: ActivatedRoute) {
    this.problem$ = problemContext.problem$;
    this.routeParams = route.snapshot.params;
    this.problemId = +route.snapshot.paramMap.get('problemId');
    this.routePrefixing = route.snapshot.data.routePrefixing;
    this.banner$ = idePlugin.banner$;
  }

  ngOnInit(): void {
    this.problemService.getProblem(this.problemId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: problem => this.problemContext.onProblemRetrieved(problem),
        error: err => this.problemContext.onProblemNotFound(err)
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.problemContext.onReset();
  }

  ngAfterViewInit(): void {
    this.allTabs = [this.problemTab, this.testcasesTab, this.submissionsTab];
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.refreshTabState();
      }
    });
    this.refreshTabState();
    this.effectResponsiveSplitter();
  }

  switchTab(tab: Tab): boolean {
    const routePrefix = this.routePrefixing(this.routeParams);
    if (tab === Tab.PROBLEM) {
      this.router.navigate([`${routePrefix}problems/${this.problemId}`]);
      this.activateTabAndDeactivateOthers(this.problemTab);
    } else if (tab === Tab.TESTCASES) {
      this.router.navigate([`${routePrefix}problems/${this.problemId}/testcases`]);
      this.activateTabAndDeactivateOthers(this.testcasesTab);
    } else if (tab === Tab.SUBMISSIONS) {
      this.router.navigate([`${routePrefix}problems/${this.problemId}/submissions`]);
      this.activateTabAndDeactivateOthers(this.submissionsTab);
    }
    return false;  // avoid <a>'s changing page
  }

  private activateTabAndDeactivateOthers(tab: ElementRef) {
    if (this.allTabs) {
      for (const t of this.allTabs) {
        if (t === tab) {
          t.nativeElement.classList.add('active');
        } else {
          t.nativeElement.classList.remove('active');
        }
      }
    }
  }

  private refreshTabState() {
    if (window.location.pathname.endsWith('testcases')) {
      this.switchTab(Tab.TESTCASES);
    } else if (window.location.pathname.endsWith('submissions')) {
      this.switchTab(Tab.SUBMISSIONS);
    }
  }

  onResize() {
    this.effectResponsiveSplitter();
  }

  private effectResponsiveSplitter() {
    if (this.splitter) {
      if (window.innerWidth <= 1000) {
        this.splitter.direction = 'vertical';
      } else {
        this.splitter.direction = 'horizontal';
      }
    }
  }

  goBack() {
    this.idePlugin.goBack$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(command => command());
  }

}


