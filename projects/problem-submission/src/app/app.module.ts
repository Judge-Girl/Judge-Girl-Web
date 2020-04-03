import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {TabPanelComponent} from './tab-panel.component';
import { ProblemDescriptionComponent } from './problem-description/problem-description.component';
import { CodePanelComponent } from './code-panel/code-panel.component';
import { SubmissionsComponent } from './submissions/submissions.component';
import {Problem} from './Problem';
import {SubmissionService} from './services/SubmissionService';
import {StubSubmissionService} from './services/StubSubmissionService';

@NgModule({
  declarations: [
    TabPanelComponent,
    ProblemDescriptionComponent,
    CodePanelComponent,
    SubmissionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [{provide: Problem, useClass: Problem},
    {provide: SubmissionService, useClass: StubSubmissionService}],
  bootstrap: [TabPanelComponent]
})
export class AppModule {
}
