import {Component} from '@angular/core';
import {Testcase} from '../../models';
import {Observable} from 'rxjs';
import {ProblemContext} from '../../contexts/ProblemContext';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-testcases',
  templateUrl: './testcases.component.html',
  styleUrls: ['./testcases.component.css', '../ide.share.css']
})
export class TestcasesComponent {
  public testCases$: Observable<Testcase[]>;

  constructor(private problemContext: ProblemContext) {
    this.testCases$ = this.problemContext.problem$.pipe(map(problem => problem.testcases));
  }

}
