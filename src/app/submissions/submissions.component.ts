import {Component, OnInit} from '@angular/core';
import {JudgeStatus, Submission, SubmissionService} from '../services/impl/SubmissionService';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css']
})
export class SubmissionsComponent implements OnInit {
  AC = JudgeStatus.AC;
  CE = JudgeStatus.CE;
  TLE = JudgeStatus.TLE;
  MLE = JudgeStatus.MLE;
  WA = JudgeStatus.WA;
  RE = JudgeStatus.RE;

  submissions: Submission[] = [];

  constructor(private submissionService: SubmissionService) {
  }

  ngOnInit(): void {
    this.submissionService.getSubmissions()
      .subscribe(s => this.addSubmissionAndSort(s));
  }

  private addSubmissionAndSort(submission: Submission) {
    this.submissions.push(submission);
    this.submissions.sort(SubmissionsComponent.compareSubmissions);
  }

  private static compareSubmissions(s1: Submission, s2: Submission): number {
    if (s1.judge.status === JudgeStatus.AC && s2.judge.status === JudgeStatus.AC) {
      if (s1.judge.runtime === s2.judge.runtime) {
        return s2.judge.memory - s1.judge.memory;
      }
    }
    return s1.judge.status === JudgeStatus.AC ? -1 :
      s2.judge.status === JudgeStatus.AC ? 1 : 0;
  }

  ifTheBestSubmissionStatusIs(status: JudgeStatus) {
    return this.submissions.length >= 1 && this.bestSubmission.judge.status === status;

  }

  get bestSubmission(): Submission {
    return this.submissions[0];
  }

}
