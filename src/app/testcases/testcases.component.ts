import {Component, OnInit} from '@angular/core';
import {ProblemService} from '../services/Services';
import {ActivatedRoute} from '@angular/router';
import {TestCase} from '../models';

@Component({
  selector: 'app-testcases',
  templateUrl: './testcases.component.html',
  styleUrls: ['./testcases.component.css']
})
export class TestcasesComponent implements OnInit {
  public testCases: TestCase[];

  constructor(private problemService: ProblemService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.problemService.getTestCases(+params.problemId).toPromise()
        .then(tc => this.testCases = tc);
    });
  }

}
