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
  loadingProblems = false;

  constructor(private problemService: ProblemService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.problemItems = [];
    this.loadingProblems = true;
    this.problemService.getProblemItemsInPage(0)
      .subscribe(item => {
        this.loadingProblems = false;
        this.problemItems.push(item);
      });
  }

  routeToProblem(problemId: number) {
    this.router.navigateByUrl(`problems/${problemId}`);
  }

  onProblemTagSelected(problemTag: string) {
    this.problemItems = [];
    this.loadingProblems = true;
    this.problemService.getProblemItemsByTag(problemTag)
      .subscribe(item => {
        this.loadingProblems = false;
        this.problemItems.push(item);
      });
  }
}
