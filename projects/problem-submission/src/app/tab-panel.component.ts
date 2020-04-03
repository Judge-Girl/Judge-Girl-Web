import {AfterContentInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Problem} from './Problem';
import {Router} from '@angular/router';

export enum Tab {
  PROBLEM, SUBMISSIONS
}

@Component({
  selector: 'app-tab-panel',
  templateUrl: './tab-panel.component.html',
  styleUrls: ['./tab-panel.component.css']
})
export class TabPanelComponent implements OnInit {
  TAB_PROBLEM = Tab.PROBLEM;
  TAB_SUBMISSIONS = Tab.SUBMISSIONS;

  constructor(public problem: Problem, private elementRef: ElementRef, private router: Router) {
    this.problem.id = this.elementRef.nativeElement.getAttribute('id');
    this.problem.title = this.elementRef.nativeElement.getAttribute('title');
    this.problem.description = this.elementRef.nativeElement.getAttribute('description');
    this.problem.exampleInput = this.elementRef.nativeElement.getAttribute('exampleInput');
    this.problem.exampleOutput = this.elementRef.nativeElement.getAttribute('exampleOutput');
    console.log(this.problem);
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

  ngOnInit(): void {
    if (window.location.pathname.endsWith('submissions')) {
      this.switchTab(this.TAB_SUBMISSIONS);
    }
  }


}

