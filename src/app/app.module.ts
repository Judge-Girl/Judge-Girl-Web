import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './login/login.component';
import {AppComponent} from './app.component';
import {ProblemListComponent} from './problem-list/problem-list.component';
import {StubLoginService} from './services/impl/StubLoginService';
import {LoginService, ProblemService} from './services/Services';
import {StubProblemService} from './services/impl/StubProblemService';
import {ProblemSubmissionTabPanelComponent} from './problem-submission-tab-panel/problem-submission-tab-panel.component';
import {ProblemDescriptionComponent} from './problem-description/problem-description.component';
import {CodePanelComponent} from './code-panel/code-panel.component';
import {SubmissionsComponent} from './submissions/submissions.component';
import {SubmissionService} from './services/impl/SubmissionService';
import {StubSubmissionService} from './services/impl/StubSubmissionService';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LdCircleComponent } from './items/ld-circle.component';

@NgModule({
  declarations: [
    /*Pages*/
    AppComponent,
    LoginComponent,
    ProblemListComponent,
    ProblemSubmissionTabPanelComponent,
    ProblemDescriptionComponent,
    CodePanelComponent,
    SubmissionsComponent,
    LdCircleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    {provide: LoginService, useClass: StubLoginService},
    {provide: ProblemService, useClass: StubProblemService},
    {provide: SubmissionService, useClass: StubSubmissionService}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
