import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ProblemService} from '../../services/Services';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'problem-tag-drop-down',
  templateUrl: './problem-tag-drop-down.component.html',
  styleUrls: []
})
export class ProblemTagDropDownComponent implements OnInit {

  constructor(private problemService: ProblemService) {
  }

  public static readonly ALL = 'All';
  @Output() tagSelect = new EventEmitter<string>();
  currentSelectedTag = ProblemTagDropDownComponent.ALL;
  problemTags: string[];

  ngOnInit(): void {
    this.problemTags = [ProblemTagDropDownComponent.ALL];
    this.problemService.getProblemTags()
      .subscribe(tags => {
        this.problemTags = [ProblemTagDropDownComponent.ALL];
        for (const tag of tags) {
          this.problemTags.push(tag);
        }
      });
  }

  selectProblemTag(problemTag: string): boolean {
    this.currentSelectedTag = problemTag;
    this.tagSelect.emit(problemTag);
    return false;  // consume the click event to prevent link navigating
  }
}
