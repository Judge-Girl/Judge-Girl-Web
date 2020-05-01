import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './login/login.component';
import {AppComponent} from './app.component';
import {ProblemListComponent} from './problem-list/problem-list.component';
import {StubStudentService} from './services/impl/StubStudentService';
import {StudentService, ProblemService, SubmissionService} from './services/Services';
import {StubProblemService} from './services/impl/StubProblemService';
import {TabPanelComponent} from './problem-submission-tab-panel/tab-panel.component';
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
import {HttpProblemService} from './services/impl/HttpProblemService';
import {HttpStudentService} from './services/impl/HttpStudentService';
import {HttpSubmissionService} from './services/impl/HttpSubmissionService';
import {AuthenticatedDirective} from './directives/AuthenticatedDirective';
import {CookieModule} from "./services/cookie/cookie.module";
import {CookieService} from "./services/cookie/cookie.service";
import { TestcasesComponent } from './testcases/testcases.component';
import {AngularSplitModule} from 'angular-split';



@NgModule({
  declarations: [
    /*Pages*/
    AppComponent,
    LoginComponent,
    ProblemListComponent,
    TabPanelComponent,
    ProblemDescriptionComponent,
    CodePanelComponent,
    SubmissionsComponent,

    /*items*/
    LdCircleComponent,

    ProblemTagDropDownComponent,

    /*directives*/
    AuthenticatedDirective,

    TestcasesComponent
  ],
  imports: [
    CookieModule.forRoot(),
    AngularSplitModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    /*primeNG*/
    BlockUIModule, ToastModule, FileUploadModule, MessagesModule,
  ],
  providers: [
    HttpClient,
    MessageService,
    CookieService,
    {provide: StudentService, useClass: StubStudentService},
    {provide: ProblemService, useClass: StubProblemService},
    {provide: SubmissionService, useClass: StubSubmissionService},
    {provide: 'BASE_URL', useValue: 'http://127.0.0.1'},
    {provide: 'PORT_STUDENT_SERVICE', useValue: 33001},
    {provide: 'PORT_PROBLEM_SERVICE', useValue: 33002},
    {provide: 'PORT_SUBMISSION_SERVICE', useValue: 33003}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
