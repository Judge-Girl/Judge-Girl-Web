import {Component, OnInit} from '@angular/core';
import {Problem} from '../models';
import {ProblemService} from '../services/Services';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-problem-description',
  templateUrl: './problem-description.component.html',
  styleUrls: ['./problem-description.component.css']
})
export class ProblemDescriptionComponent implements OnInit {
  private problem$: Observable<Problem>;

  problem: Problem;

  constructor(private problemService: ProblemService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.problem$ = this.route.parent.params.pipe(switchMap(params =>
      this.problemService.getProblem(+params.problemId)
    ));
    this.problem$.subscribe(p => this.problem = p);
  }

}
