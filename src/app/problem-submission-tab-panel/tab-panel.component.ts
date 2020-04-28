import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {StudentService} from '../services/Services';

export enum Tab {
  TESTCASES,
  PROBLEM, SUBMISSIONS
}

@Component({
  selector: 'app-tab-panel',
  templateUrl: './tab-panel.component.html',
  styleUrls: ['./tab-panel.component.css']
})
export class TabPanelComponent implements OnInit, AfterViewInit {

  constructor(private elementRef: ElementRef, public studentService: StudentService,
              private router: Router, private route: ActivatedRoute) {
    route.params.subscribe(params => this.problemId = +params.problemId);
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.refreshTabState();
      }
    });
  }

  readonly TAB_SUBMISSIONS = Tab.SUBMISSIONS;
  readonly TAB_PROBLEM = Tab.PROBLEM;
  readonly TAB_TESTCASES = Tab.TESTCASES;

  @ViewChild('problemTab') problemTab: ElementRef;
  @ViewChild('testcasesTab') testcasesTab: ElementRef;
  @ViewChild('submissionsTab') submissionsTab: ElementRef;
  private allTabs: ElementRef[];

  private problemId: number;

  ngOnInit(): void {
    this.refreshTabState();
  }

  ngAfterViewInit(): void {
    this.allTabs = [this.problemTab, this.testcasesTab, this.submissionsTab];
  }

  switchTab(tab: Tab): boolean {
    if (tab === Tab.PROBLEM) {
      this.router.navigate([`problems/${this.problemId}`]);
      this.activateTabAndDeactivateOthers(this.problemTab);
    } else if (tab === Tab.TESTCASES) {
      this.router.navigate([`problems/${this.problemId}/testcases`], {skipLocationChange: true});
      this.activateTabAndDeactivateOthers(this.testcasesTab);
    } else if (tab === Tab.SUBMISSIONS) {
      this.router.navigate([`problems/${this.problemId}/submissions`], {skipLocationChange: true});
      this.activateTabAndDeactivateOthers(this.submissionsTab);
    }
    return false;  // avoid <a>'s changing page
  }

  private activateTabAndDeactivateOthers(tab: ElementRef) {
    for (const t of this.allTabs) {
      if (t === tab) {
        t.nativeElement.classList.add('active');
      } else {
        t.nativeElement.classList.remove('active');
      }
    }
  }

  private refreshTabState() {
    if (window.location.pathname.endsWith('submissions')) {
      console.log(window.location.pathname);
      this.switchTab(Tab.SUBMISSIONS);
    }
  }


}


