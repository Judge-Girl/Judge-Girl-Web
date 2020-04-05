import {Component, OnInit} from '@angular/core';
import {ProblemService} from '../services/Services';
import {ProblemItem} from '../models';
import {Router} from "@angular/router";

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
    this.problemService.currentProblemId = undefined;
    this.problemService.getProblemItems(0)
      .subscribe(item => {
        if (!this.problemItems) {
          this.problemItems = [];
        }
        this.problemItems.push(item);
      });
  }

  routeToProblem(problemId: number) {
    this.problemService.currentProblemId = problemId;
    this.router.navigateByUrl(`problems/${problemId}`);
  }

}
