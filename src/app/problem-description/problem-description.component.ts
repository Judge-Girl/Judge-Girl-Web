import {Component, OnInit} from '@angular/core';
import {ProblemSubmissionTabPanelComponent} from '../problem-submission-tab-panel/problem-submission-tab-panel.component';
import {Problem} from '../models';

@Component({
  selector: 'app-problem-description',
  templateUrl: './problem-description.component.html',
  styleUrls: ['../../styles.css', './problem-description.component.css']
})
export class ProblemDescriptionComponent implements OnInit {
  problem: Problem;

  constructor(private parent: ProblemSubmissionTabPanelComponent) {
    this.problem = parent.problem;
  }

  ngOnInit(): void {
  }

}
