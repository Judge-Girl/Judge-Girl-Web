import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-problem-submission',
  templateUrl: './problem-submission.component.html',
  styleUrls: ['./problem-submission.component.css']
})
export class ProblemSubmissionComponent implements OnInit {
  @Input() title: string;
  @Input() description: string;
  @Input() exampleInput: string;
  @Input() exampleOutput: string;


  constructor() {
  }

  ngOnInit(): void {
  }

}
