import {Component, OnInit} from '@angular/core';
import {ProblemService} from '../../services/Services';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'problem-tag-drop-down',
  templateUrl: './problem-tag-drop-down.component.html',
  styleUrls: []
})
export class ProblemTagDropDownComponent implements OnInit {
  private readonly DUMMY_TAG = 'All';
  currentSelectedTag = this.DUMMY_TAG;
  problemTags: string[];

  constructor(private problemService: ProblemService) {
  }

  ngOnInit(): void {
    this.problemTags = [this.DUMMY_TAG];
    this.problemService.getProblemTags()
      .subscribe(tag => {
        this.problemTags.push(tag);
        console.log(this.problemTags);
      });
  }

  selectProblemTag(problemTag: string): boolean {
    this.currentSelectedTag = problemTag;

    return false;  // consume the click event
  }
}
