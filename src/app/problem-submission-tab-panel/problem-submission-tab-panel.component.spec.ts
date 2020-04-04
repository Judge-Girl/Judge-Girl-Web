import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemSubmissionTabPanelComponent } from './problem-submission-tab-panel.component';

describe('ProblemSubmissionComponent', () => {
  let component: ProblemSubmissionTabPanelComponent;
  let fixture: ComponentFixture<ProblemSubmissionTabPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProblemSubmissionTabPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemSubmissionTabPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
