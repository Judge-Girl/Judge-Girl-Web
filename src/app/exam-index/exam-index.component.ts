import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import { ExamService } from '../services/Services';
import { Exam } from '../models';
import {SplitAreaDirective, SplitComponent} from 'angular-split';

export enum Tab {
  PROBLEMS, SUBMISSIONS, SCOREBOARD,
}

@Component({
  selector: 'app-exam-index',
  templateUrl: './exam-index.component.html',
  styleUrls: ['./exam-index.component.css']
})
export class ExamIndexComponent implements OnInit, AfterViewInit {

  constructor(private elementRef: ElementRef, public examService: ExamService,
              private router: Router, private route: ActivatedRoute) {
    route.params.subscribe(params => this.examId = +params.examId);

  }

  readonly TAB_PROBLEMS = Tab.PROBLEMS;
  readonly TAB_SUBMISSIONS = Tab.SUBMISSIONS;
  readonly TAB_SCOREBOARD = Tab.SCOREBOARD;

  @ViewChild('problemsTab') problemsTab: ElementRef;
  @ViewChild('submissionsTab') submissionsTab: ElementRef;
  @ViewChild('scoreboardTab') scoreboardTab: ElementRef;
  @ViewChild('splitter') splitter: SplitComponent;
  private allTabs: ElementRef[];

  private examId: number;
  public isLoading: boolean;
  public exam: Exam;

  ngOnInit(): void {
	this.isLoading = true;
    this.examService.getExam(this.examId)
      .subscribe(e => {
		this.exam = e;
		this.isLoading = false;
      });
  }

  ngAfterViewInit(): void {
    this.allTabs = [this.problemsTab, this.submissionsTab, this.scoreboardTab];
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.refreshTabState();
      }
    });
    this.refreshTabState();
  }


  switchTab(tab: Tab): boolean {
    if (tab === Tab.PROBLEMS) {
      this.router.navigate([`exam/${this.examId}`]);
      this.activateTabAndDeactivateOthers(this.problemsTab);
    } else if (tab === Tab.SUBMISSIONS) {
      this.router.navigate([`exam/${this.examId}/submissions`]);
      this.activateTabAndDeactivateOthers(this.submissionsTab);
    } else if (tab === Tab.SCOREBOARD) {
      this.router.navigate([`exam/${this.examId}/scoreboard`]);
      this.activateTabAndDeactivateOthers(this.scoreboardTab);
    }
    return false;  // avoid <a>'s changing page
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

  private refreshTabState() {
    if (window.location.pathname.endsWith('scoreboard')) {
      this.switchTab(Tab.SCOREBOARD);
    } else if (window.location.pathname.endsWith('submissions')) {
	  this.switchTab(Tab.SUBMISSIONS);
    }
  }

  routeToExamList() {
	this.router.navigateByUrl('exams');
  }
}


