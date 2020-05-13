import {Component, OnInit} from '@angular/core';
import {ProblemService} from '../services/Services';
import {ActivatedRoute} from '@angular/router';
import {TestCase, describeMemory, describeTimeInSeconds} from '../models';

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

  describeMemory(memoryInBytes: number): string {
    return describeMemory(memoryInBytes);
  }

  describeTimeInSeconds(ms: number) {
    return describeTimeInSeconds(ms);
  }

}
