import {Component, OnInit} from '@angular/core';
import {ProblemService} from '../services/Services';
import {ProblemItem} from '../models';
import {Router} from '@angular/router';

@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {
  problemItems: ProblemItem[];

  constructor(private problemService: ProblemService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.problemItems = [];
    this.problemService._currentProblemId = undefined;
    this.problemService.getProblemItemsInPage(0)
      .subscribe(item => {
        this.problemItems.push(item);
      });
  }

  routeToProblem(problemId: number) {
    this.problemService._currentProblemId = problemId;
    this.router.navigateByUrl(`problems/${problemId}`);
  }

}
