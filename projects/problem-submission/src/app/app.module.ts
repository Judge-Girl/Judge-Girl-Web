import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {ProblemSubmissionComponent} from './problem-submission/problem-submission.component';
import { ProblemDescriptionComponent } from './problem-description/problem-description.component';
import { CodePanelComponent } from './code-panel/code-panel.component';
import { SubmissionsComponent } from './submissions/submissions.component';

@NgModule({
  declarations: [
    ProblemSubmissionComponent,
    ProblemDescriptionComponent,
    CodePanelComponent,
    SubmissionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [ProblemSubmissionComponent]
})
export class AppModule {
}
