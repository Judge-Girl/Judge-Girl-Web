import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './login/login.component';
import {AppComponent} from './app.component';
import {ProblemListComponent} from './problem-list/problem-list.component';
import {StubLoginService} from './services/impl/StubLoginService';
import {LoginService, ProblemService, SubmissionService} from './services/Services';
import {StubProblemService} from './services/impl/StubProblemService';
import {ProblemSubmissionTabPanelComponent} from './problem-submission-tab-panel/problem-submission-tab-panel.component';
import {ProblemDescriptionComponent} from './problem-description/problem-description.component';
import {CodePanelComponent} from './code-panel/code-panel.component';
import {SubmissionsComponent} from './submissions/submissions.component';
import {StubSubmissionService} from './services/impl/StubSubmissionService';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LdCircleComponent} from './items/id-circle/ld-circle.component';
import {FileUploadModule} from 'primeng/fileupload';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {BlockUIModule, MessageService, MessagesModule, ToastModule} from 'primeng';
import { ProblemTagDropDownComponent } from './items/problem-tag-drop-down/problem-tag-drop-down.component';


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

    /*items*/
    LdCircleComponent,

    ProblemTagDropDownComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    /*primeNG*/
    BlockUIModule, ToastModule, FileUploadModule, MessagesModule
  ],
  providers: [
    HttpClient,
    MessageService,
    {provide: LoginService, useClass: StubLoginService},
    {provide: ProblemService, useClass: StubProblemService},
    {provide: SubmissionService, useClass: StubSubmissionService}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
