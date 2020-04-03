import {Component, OnInit} from '@angular/core';
import {ProblemService} from '../services/Services';
import {ProblemItem} from '../models/Problems';

@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {
  problemItems: ProblemItem[] = [];

  constructor(private problemService: ProblemService) {
  }

  ngOnInit(): void {
    this.problemService.getProblemItems(0)
      .subscribe(item => this.problemItems.push(item));
  }

  routeToProblem(problemId: number) {
    window.location.href = `/problems/${problemId}`;
  }

}
