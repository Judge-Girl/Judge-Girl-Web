import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeUploadPanelComponent } from './code-upload-panel.component';

describe('CodePanelComponent', () => {
  let component: CodeUploadPanelComponent;
  let fixture: ComponentFixture<CodeUploadPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeUploadPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeUploadPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
