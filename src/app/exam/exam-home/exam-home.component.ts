import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {ExamService, StudentService} from '../../services/Services';
import {Exam} from '../../models';
import {SplitComponent} from 'angular-split';

export enum Tab {
  PROBLEMS, SUBMISSIONS, SCOREBOARD,
}

@Component({
  selector: 'app-exam-home',
  templateUrl: './exam-home.component.html',
  styleUrls: ['./exam-home.component.css']
})
export class ExamHomeComponent implements OnInit, AfterViewInit {

  constructor(public studentService: StudentService,
              public examService: ExamService,
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
    if (this.studentService.authenticate()) {
      this.examService.getExamOverview(this.examId)
        .subscribe(e => {
          this.exam = e;
          this.isLoading = false;
        });
    }
  }

  ngAfterViewInit(): void {
    this.allTabs = [this.problemsTab, this.submissionsTab, this.scoreboardTab];
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
      this.router.navigate([`exams/${this.examId}`]);
    } else if (tab === Tab.SUBMISSIONS) {
      this.router.navigate([`exams/${this.examId}/submissions`]);
    } else if (tab === Tab.SCOREBOARD) {
      this.router.navigate([`exams/${this.examId}/scoreboard`]);
    }
  }

  private refreshTabElementsState() {
    if (window.location.pathname.endsWith('scoreboard')) {
      this.activateTabAndDeactivateOthers(this.scoreboardTab);
    } else if (window.location.pathname.endsWith('submissions')) {
      this.activateTabAndDeactivateOthers(this.submissionsTab);
    } else {
      this.activateTabAndDeactivateOthers(this.problemsTab);
    }
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
    if (window.location.pathname.endsWith('scoreboard')) {
      this.routeToTab(Tab.SCOREBOARD);
    } else if (window.location.pathname.endsWith('submissions')) {
      this.routeToTab(Tab.SUBMISSIONS);
    } else {
      this.routeToTab(Tab.PROBLEMS);
    }
  }

  routeToExamList() {
    this.router.navigateByUrl('/exams');
  }

  routeToCurrentExamIndex() {
    this.router.navigateByUrl(`/exams/${this.exam.id}`);
    this.refreshTabElementsState();
  }
}


