import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ExamService} from '../../services/Services';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'exam-tag-drop-down',
  templateUrl: './exam-tag-drop-down.component.html',
  styleUrls: []
})
export class ExamTagDropDownComponent implements OnInit {

  constructor(private examService: ExamService) {
  }

  public static readonly ALL = 'All';
  @Output() tagSelect = new EventEmitter<string>();
  currentSelectedTag = ExamTagDropDownComponent.ALL;
  examTags: string[];

  ngOnInit(): void {
    this.examTags = [ExamTagDropDownComponent.ALL];
    this.examService.getExamTags()
      .subscribe(tags => {
        this.examTags = [ExamTagDropDownComponent.ALL];
        for (const tag of tags) {
          this.examTags.push(tag);
        }
      });
  }

  selectExamTag(examTag: string): boolean {
    this.currentSelectedTag = examTag;
    this.tagSelect.emit(examTag);
    return false;  // consume the click event to prevent link navigating
  }
}
