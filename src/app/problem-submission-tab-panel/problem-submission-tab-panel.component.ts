import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Problem} from '../models';
import {ProblemService} from '../services/Services';

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
  @Input() problemId: number;
  problem: Problem;

  constructor(private elementRef: ElementRef,
              private router: Router,
              private problemService: ProblemService) {
  }

  ngOnInit(): void {
    this.problemService.getProblem(this.problemId)
      .subscribe((p) => this.problem = p);
  }


  switchTab(tab: Tab): boolean {
    console.log(tab);
    const problemTab = document.getElementById('problem-tab');
    const submissionsTab = document.getElementById('submissions-tab');
    if (tab === Tab.PROBLEM) {
      this.router.navigateByUrl('problem');
      problemTab.classList.add('active');
      submissionsTab.classList.remove('active');
    } else if (tab === Tab.SUBMISSIONS) {
      this.router.navigateByUrl('submissions');
      problemTab.classList.remove('active');
      submissionsTab.classList.add('active');
    }
    return false;  // to disable <a>'s triggering of changing page
  }


}

