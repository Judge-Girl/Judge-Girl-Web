import {Component, OnInit} from '@angular/core';
import {ProblemService} from '../services/Services';
import {ProblemItem} from '../models';
import {Router} from '@angular/router';
import {ProblemTagDropDownComponent} from '../items/problem-tag-drop-down/problem-tag-drop-down.component';


/**
 * TODO Currently not supporting pagination, so use 0th page instead
 */
@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['../../animations.css', './problem-list.component.css']
})
export class ProblemListComponent implements OnInit {
  problemItems: ProblemItem[];
  loadingProblems = false;

  constructor(private problemService: ProblemService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.problemItems = [];
    this.loadingProblems = true;
    this.problemService.getProblemItemsInPage(0)
      .subscribe(items => {
        this.loadingProblems = false;
        this.problemItems = items;
      });
  }

  routeToProblem(problemId: number) {
    this.router.navigateByUrl(`problems/${problemId}`);
  }

  onProblemTagSelected(problemTag: string) {
    this.problemItems = [];
    this.loadingProblems = true;
    if (ProblemTagDropDownComponent.ALL === problemTag) {
      this.problemService.getProblemItemsInPage(0)
          .subscribe(items => {
            this.loadingProblems = false;
            this.problemItems = items;
          });
    } else {
      this.problemService.getProblemItemsByTag(problemTag)
          .subscribe(items => {
            this.loadingProblems = false;
            this.problemItems = items;
          });
    }
  }
}
