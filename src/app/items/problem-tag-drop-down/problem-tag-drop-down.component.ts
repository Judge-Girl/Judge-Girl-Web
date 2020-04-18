import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ProblemService} from '../../services/Services';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'problem-tag-drop-down',
  templateUrl: './problem-tag-drop-down.component.html',
  styleUrls: []
})
export class ProblemTagDropDownComponent implements OnInit {
  @Output() tagSelect = new EventEmitter<string>();
  public readonly DUMMY_TAG = 'All';
  currentSelectedTag = this.DUMMY_TAG;
  problemTags: string[];

  constructor(private problemService: ProblemService) {
  }

  ngOnInit(): void {
    this.problemTags = [this.DUMMY_TAG];
    this.problemService.getProblemTags()
      .subscribe(tags => {
        this.problemTags = tags;
      });
  }

  selectProblemTag(problemTag: string): boolean {
    this.currentSelectedTag = problemTag;
    this.tagSelect.emit(problemTag);
    return false;  // consume the click event to prevent link navigating
  }
}
