import {Component} from '@angular/core';
import {describeMemory, describeTimeInSeconds, TestCase} from '../../models';
import {Observable} from 'rxjs';
import {ProblemContext} from '../../contexts/ProblemContext';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-testcases',
  templateUrl: './testcases.component.html',
  styleUrls: ['./testcases.component.css']
})
export class TestcasesComponent {
  public testCases$: Observable<TestCase[]>;

  constructor(private problemContext: ProblemContext) {
    this.testCases$ = this.problemContext.problem$.pipe(map(problem => problem.testcases));
  }

  describeMemory(memoryInBytes: number): string {
    return describeMemory(memoryInBytes);
  }

  describeTimeInSeconds(ms: number) {
    return describeTimeInSeconds(ms);
  }

}
