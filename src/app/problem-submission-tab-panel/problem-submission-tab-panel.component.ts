import {Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

export enum Tab {
  PROBLEM, SUBMISSIONS
}

@Component({
  selector: 'app-tab-panel',
  templateUrl: './problem-submission-tab-panel.component.html',
  styleUrls: ['./problem-submission-tab-panel.component.css']
})
export class ProblemSubmissionTabPanelComponent implements OnInit {
  TAB_PROBLEM = Tab.PROBLEM;
  TAB_SUBMISSIONS = Tab.SUBMISSIONS;

  private problemId: number;

  constructor(private elementRef: ElementRef,
              private router: Router, private route: ActivatedRoute) {
    route.params.subscribe(params => this.problemId = +params.problemId);
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.refreshTabState();
      }
    });
  }

  ngOnInit(): void {
    this.refreshTabState();
  }


  switchTab(tab: Tab): boolean {
    console.log(tab);
    const problemTab = document.getElementById('problem-tab');
    const submissionsTab = document.getElementById('submissions-tab');
    if (tab === Tab.PROBLEM) {
      this.router.navigate([`problems/${this.problemId}`], {skipLocationChange: true});
      problemTab.classList.add('active');
      submissionsTab.classList.remove('active');
    } else if (tab === Tab.SUBMISSIONS) {
      this.router.navigate([`problems/${this.problemId}/submissions`], {skipLocationChange: true});
      problemTab.classList.remove('active');
      submissionsTab.classList.add('active');
    }
    return false;  // to disable <a>'s triggering of changing page
  }

  private refreshTabState() {
    if (window.location.pathname.endsWith('submissions')) {
      console.log(window.location.pathname);
      this.switchTab(Tab.SUBMISSIONS);
    }
  }

}

