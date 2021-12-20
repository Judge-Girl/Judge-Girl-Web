import {AfterViewInit, Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import {SplitComponent} from 'angular-split';

import {ProblemContext} from '../../contexts/ProblemContext';
import {Observable, Subject} from 'rxjs';
import {Problem} from '../../models';
import {IdeCommands, IdePlugin, IdeViewModel} from './ide.plugin';
import {map} from 'rxjs/operators';
import {StudentContext} from '../../contexts/StudentContext';
import {ProblemService} from '../../services/Services';

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
  banner$: Observable<Banner>;
  problem$: Observable<Problem>;
  private ideCommands: IdeCommands;
  private ideViewModel$: Observable<IdeViewModel>;
  private getProblem$: Observable<Problem>;

  constructor(private problemService: ProblemService,
              private problemContext: ProblemContext,
              public studentContext: StudentContext,
              private router: Router, private route: ActivatedRoute,
              injector: Injector) {
    this.problem$ = problemContext.problem$;
    this.routeParams = route.snapshot.params;
    this.problemId = +route.snapshot.paramMap.get('problemId');
    const idePlugin = injector.get<IdePlugin>(route.snapshot.data.idePluginProvider);
    this.ideCommands = idePlugin.commands(route);
    this.ideViewModel$ = idePlugin.viewModel$;
    this.getProblem$ = idePlugin.getProblem(this.problemId);
    this.banner$ = this.ideViewModel$.pipe(map(vm => vm.banner));
  }

  ngOnInit(): void {
    this.getProblem$.toPromise()
      .then(problem => this.problemContext.initializeProblem(problem))
      .catch(err => this.problemContext.problemNotFound(err));
  }

  ngOnDestroy(): void {
    this.problemContext.destroy();
    this.onDestroy$.next();
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
    const routePrefix = this.ideCommands.getTabRoutingPrefix();
    if (tab === Tab.PROBLEM) {
      this.router.navigateByUrl(`${routePrefix}problems/${this.problemId}`, {replaceUrl: true});
      this.activateTabAndDeactivateOthers(this.problemTab);
    } else if (tab === Tab.TESTCASES) {
      this.router.navigateByUrl(`${routePrefix}problems/${this.problemId}/testcases`, {replaceUrl: true});
      this.activateTabAndDeactivateOthers(this.testcasesTab);
    } else if (tab === Tab.SUBMISSIONS) {
      this.router.navigateByUrl(`${routePrefix}problems/${this.problemId}/submissions`, {replaceUrl: true});
      this.activateTabAndDeactivateOthers(this.submissionsTab);
    }
    return false;  // avoid <a> from changing page
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
    return this.ideCommands.goBack();
  }

}


