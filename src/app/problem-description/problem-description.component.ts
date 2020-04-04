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

  constructor(private problemService: ProblemService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params);
      this.problemService.getProblem(+(params.problemId))
        .subscribe((p) => {
          this.problem = p;
          console.log(`Problem found by id ${+(params.problemId)}: ${p}`);
        });
    });
  }

}
