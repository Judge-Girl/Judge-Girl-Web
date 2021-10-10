import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './pages/students/login/login.component';
import {AppComponent} from './app.component';
import {ProblemListComponent} from './pages/problems/problem-list.component';
import {ExamListComponent} from './pages/exam/list/exam-list.component';
import {ExamHomeComponent} from './pages/exam/root/home/exam-home.component';
import {ExamQuestionsComponent} from './pages/exam/root/home/questions/exam-questions.component';
import {BrokerService, ExamService, ProblemService, StudentService, SubmissionService} from './services/Services';
import {IdeComponent} from './pages/ide/ide.component';
import {ProblemDescriptionComponent} from './pages/ide/problem-description/problem-description.component';
import {CodeUploadPanelComponent} from './pages/ide/code-panel/code-upload-panel.component';
import {SubmissionsComponent} from './pages/ide/submissions/submissions.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LdCircleComponent} from './commons/widgets/spinners/ld-circle.component';
import {FileUploadModule} from 'primeng/fileupload';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {BlockUIModule, MessageService, MessagesModule, ToastModule} from 'primeng';
import {HttpProblemService} from './services/impl/HttpProblemService';
import {HttpExamService} from './services/impl/HttpExamService';
import {HttpStudentService} from './services/impl/HttpStudentService';
import {HttpSubmissionService} from './services/impl/HttpSubmissionService';
import {CookieModule} from './services/cookie/cookie.module';
import {CookieService} from './services/cookie/cookie.service';
import {TestcasesComponent} from './pages/ide/testcases/testcases.component';
import {AngularSplitModule} from 'angular-split';
import {ChangePasswordComponent} from './pages/students/change-password/change-password.component';
import {FormsModule} from '@angular/forms';
import {StompBrokerService} from './services/impl/StompBrokerService';
import {EventBus} from './services/EventBus';
import {ExamQuestionSubmissionService, HttpExamQuestionSubmissionService} from './services/impl/HttpExamQuestionSubmissionService';
import {IdeBannerComponent} from './pages/ide/banner/ide-banner.component';
import {LdSpinnerComponent} from './commons/widgets/spinners/ld-spinner.component';
import {ExamContext} from './contexts/ExamContext';
import {WithLoadingPipe} from './commons/pipes/with-loading.pipe';
import {ProblemContext} from './contexts/ProblemContext';
import {OopsComponent} from './pages/ide/oops.component';
import {SubmissionContext} from './contexts/SubmissionContext';
import {AuthHttpRequestInterceptor} from './services/impl/AuthHttpRequestInterceptor';
import {ExamIdePlugin} from './pages/exam/ide.plugin';
import {DefaultIdePlugin} from './pages/ide/ide.default.plugin';
import {VarDirective} from './commons/directives/ng-var.directive';
import {ExamRootComponent} from './pages/exam/root/exam-root.component';
import {DescribeMemoryPipe} from './commons/pipes/describe-memory.pipe';
import {InSecondsPipe} from './commons/pipes/in-seconds.pipe';
import {FromNowPipe} from './commons/pipes/from-now.pipe';

@NgModule({
  declarations: [
    /*Pipes*/
    WithLoadingPipe,
    DescribeMemoryPipe,
    InSecondsPipe,
    FromNowPipe,

    /*Directives*/
    VarDirective,

    /*Pages*/
    AppComponent,
    LoginComponent,
    ChangePasswordComponent,
    ProblemListComponent,
    IdeComponent,
    IdeBannerComponent,
    ProblemDescriptionComponent,
    TestcasesComponent,
    SubmissionsComponent,
    CodeUploadPanelComponent,
    ExamListComponent,
    ExamRootComponent,
    ExamHomeComponent,
    ExamQuestionsComponent,
    OopsComponent,

    /*widgets*/
    LdCircleComponent,
    LdSpinnerComponent
  ],
  imports: [
    CookieModule.forRoot(),
    AngularSplitModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,

    /*primeNG*/
    BlockUIModule, ToastModule, FileUploadModule, MessagesModule
  ],
  providers: [
    /* external services */
    HttpClient,
    MessageService,
    CookieService,

    /* services */
    {provide: StudentService, useClass: HttpStudentService},
    {provide: ProblemService, useClass: HttpProblemService},
    {provide: ExamService, useClass: HttpExamService},
    {provide: SubmissionService, useClass: HttpSubmissionService},
    {provide: ExamQuestionSubmissionService, useClass: HttpExamQuestionSubmissionService},
    {provide: ExamService, useClass: HttpExamService},
    {provide: BrokerService, useClass: StompBrokerService},
    {provide: EventBus, useClass: EventBus},

    /* contexts */
    {provide: ExamContext, useClass: ExamContext},
    {provide: ProblemContext, useClass: ProblemContext},
    {provide: SubmissionContext, useClass: SubmissionContext},

    /* plugins */
    {provide: DefaultIdePlugin, useClass: DefaultIdePlugin},
    {provide: ExamIdePlugin, useClass: ExamIdePlugin},
    {provide: HTTP_INTERCEPTORS, useClass: AuthHttpRequestInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
