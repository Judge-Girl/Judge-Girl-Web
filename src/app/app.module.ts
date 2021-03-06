import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './login/login.component';
import {AppComponent} from './app.component';
import {ProblemListComponent} from './problem-list/problem-list.component';
import {ExamListComponent} from './exam-list/exam-list.component';
import {StubStudentService} from './services/impl/StubStudentService';
import {StudentService, ProblemService, ExamService, SubmissionService} from './services/Services';
import {StubProblemService} from './services/impl/StubProblemService';
import {StubExamService} from './services/impl/StubExamService';
import {MultiTabsPanelComponent} from './problem-submission-tab-panel/multi-tabs-panel.component';
import {ProblemDescriptionComponent} from './problem-description/problem-description.component';
import {CodeUploadPanelComponent} from './code-panel/code-upload-panel.component';
import {SubmissionsComponent} from './submissions/submissions.component';
import {StubSubmissionService} from './services/impl/StubSubmissionService';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LdCircleComponent} from './items/id-circle/ld-circle.component';
import {FileUploadModule} from 'primeng/fileupload';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {BlockUIModule, MessageService, MessagesModule, ToastModule} from 'primeng';
import {ProblemTagDropDownComponent} from './items/problem-tag-drop-down/problem-tag-drop-down.component';
import {HttpProblemService} from './services/impl/HttpProblemService';
import {HttpExamService} from './services/impl/HttpExamService';
import {HttpStudentService} from './services/impl/HttpStudentService';
import {HttpSubmissionService} from './services/impl/HttpSubmissionService';
import {AuthenticatedDirective} from './directives/AuthenticatedDirective';
import {CookieModule} from './services/cookie/cookie.module';
import {CookieService} from './services/cookie/cookie.service';
import {TestcasesComponent} from './testcases/testcases.component';
import {AngularSplitModule} from 'angular-split';


@NgModule({
  declarations: [
    /*Pages*/
    AppComponent,
    LoginComponent,
    ProblemListComponent,
    ExamListComponent,
    MultiTabsPanelComponent,
    ProblemDescriptionComponent,
    CodeUploadPanelComponent,
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
    {provide: StudentService, useClass: HttpStudentService},
    {provide: ProblemService, useClass: HttpProblemService},
    {provide: ExamService, useClass: HttpExamService},
    {provide: SubmissionService, useClass: HttpSubmissionService},
    {provide: 'BASE_URL', useValue: 'http://localhost'},
    {provide: 'PORT_STUDENT_SERVICE', useValue: 80},
    {provide: 'PORT_PROBLEM_SERVICE', useValue: 80},
    {provide: 'PORT_EXAM_SERVICE', useValue: 80},
    {provide: 'PORT_SUBMISSION_SERVICE', useValue: 80}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
