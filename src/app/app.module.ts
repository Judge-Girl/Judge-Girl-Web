import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './users/login/login.component';
import {AppComponent} from './app.component';
import {ProblemListComponent} from './problem-list/problem-list.component';
import {ExamListComponent} from './exam/list/exam-list.component';
import {ExamHomeComponent} from './exam/home/exam-home.component';
import {ExamQuestionsComponent} from './exam/home/questions/exam-questions.component';
import {BrokerService, ExamService, ProblemService, StudentService, SubmissionService} from '../services/Services';
import {IdeComponent} from './ide/ide.component';
import {ProblemDescriptionComponent} from './ide/problem-description/problem-description.component';
import {CodeUploadPanelComponent} from './ide/code-panel/code-upload-panel.component';
import {SubmissionsComponent} from './ide/submissions/submissions.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LdCircleComponent} from './items/spinners/ld-circle.component';
import {FileUploadModule} from 'primeng/fileupload';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {BlockUIModule, MessageService, MessagesModule, ToastModule} from 'primeng';
import {ProblemTagDropDownComponent} from './items/problem-tag-drop-down/problem-tag-drop-down.component';
import {HttpProblemService} from '../services/impl/HttpProblemService';
import {HttpExamService} from '../services/impl/HttpExamService';
import {HttpStudentService} from '../services/impl/HttpStudentService';
import {HttpSubmissionService} from '../services/impl/HttpSubmissionService';
import {CookieModule} from '../services/cookie/cookie.module';
import {CookieService} from '../services/cookie/cookie.service';
import {TestcasesComponent} from './ide/testcases/testcases.component';
import {AngularSplitModule} from 'angular-split';
import {ChangePasswordComponent} from './users/change-password/change-password.component';
import {FormsModule} from '@angular/forms';
import {StompBrokerService} from '../services/impl/StompBrokerService';
import {RxStompConfig} from '@stomp/rx-stomp';
import {EventBus} from '../services/EventBus';
import {ExamQuestionSubmissionService, HttpExamQuestionSubmissionService} from '../services/impl/HttpExamQuestionSubmissionService';
import {IdeBannerComponent} from './exam/question-banner/ide-banner.component';
import {LdSpinnerComponent} from './items/spinners/ld-spinner.component';
import {ExamContext} from './contexts/ExamContext';
import {WithLoadingPipe} from './pipes/with-loading.pipe';
import {ProblemContext} from './contexts/ProblemContext';
import {OopsComponent} from './ide/oops.component';
import {SubmissionContext} from './contexts/SubmissionContext';
import {AuthHttpRequestInterceptor} from '../services/impl/AuthHttpRequestInterceptor';
import {ExamIdePlugin} from './exam/ide.plugin';
import {DefaultIdePlugin} from './ide/ide.default.plugin';
import {VarDirective} from './ng-var.directive';
import {ExamRootComponent} from './exam/root/exam-root.component';


const DOMAIN = 'api.judgegirl.beta.pdlab.csie.ntu.edu.tw';
const HTTP_HOST = `http://${DOMAIN}`;


@NgModule({
  declarations: [
    /*Pipes*/
    WithLoadingPipe,

    /*Directives*/
    VarDirective,

    /*Pages*/
    AppComponent,
    ProblemTagDropDownComponent,
    LoginComponent,
    ChangePasswordComponent,
    ProblemListComponent,
    TestcasesComponent,
    ExamListComponent,
    IdeComponent,
    ProblemDescriptionComponent,

    CodeUploadPanelComponent,
    SubmissionsComponent,

    ExamHomeComponent,

    /*items*/
    ExamQuestionsComponent,
    IdeBannerComponent,
    LdCircleComponent,
    LdSpinnerComponent,
    OopsComponent,
    ExamRootComponent
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
