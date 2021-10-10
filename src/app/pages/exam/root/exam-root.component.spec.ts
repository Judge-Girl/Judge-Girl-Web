import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamRootComponent } from './exam-root.component';

describe('ExamRootComponentComponent', () => {
  let component: ExamRootComponent;
  let fixture: ComponentFixture<ExamRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
