import {Component, OnInit} from '@angular/core';
import {ProblemService} from '../../services/Services';
import {ProblemItem} from '../../models';
import {Router} from '@angular/router';


@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['../../../animations.css', './problem-list.component.css']
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
    // Currently we do not support 'Pagination', therefore use the 0th page as default.
    this.problemService.getProblemItemsInPage(0)
      .subscribe(items => {
        this.loadingProblems = false;
        this.problemItems = items;
      });
  }

  routeToProblem(problemId: number) {
    this.router.navigateByUrl(`problems/${problemId}`);
  }

}
