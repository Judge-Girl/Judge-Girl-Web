import {Component, OnInit} from '@angular/core';
import {Problem} from '../models';
import {ProblemService} from '../services/Services';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-problem-description',
  templateUrl: './problem-description.component.html',
  styleUrls: ['./problem-description.component.css']
})
export class ProblemDescriptionComponent implements OnInit {
  problem: Problem;

  constructor(private problemService: ProblemService) {
  }

  ngOnInit(): void {
    this.problemService.getProblem(this.problemService.currentProblemId)
      .subscribe((p) => {
        this.problem = p;
      });
  }

}
