import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiTabsPanelComponent } from './multi-tabs-panel.component';

describe('ProblemSubmissionComponent', () => {
  let component: MultiTabsPanelComponent;
  let fixture: ComponentFixture<MultiTabsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiTabsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiTabsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
