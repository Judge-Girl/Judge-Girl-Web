import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemTagDropDownComponent } from './problem-tag-drop-down.component';

describe('ProblemTagDropDownComponent', () => {
  let component: ProblemTagDropDownComponent;
  let fixture: ComponentFixture<ProblemTagDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProblemTagDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemTagDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
