import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './users/login/login.component';
import {AppComponent} from './app.component';
import {ProblemListComponent} from './problem-list/problem-list.component';
import {ExamListComponent} from './exam/exam-list/exam-list.component';
import {ExamHomeComponent} from './exam/exam-home/exam-home.component';
import {ExamProblemsComponent} from './exam/exam-problems/exam-problems.component';
import {ExamScoreboardComponent} from './exam/exam-scoreboard/exam-scoreboard.component';
import {ExamSubmissionsComponent} from './exam/exam-submissions/exam-submissions.component';
import {BrokerService, ExamService, ProblemService, StudentService, SubmissionService} from './services/Services';
// import {StubExamService} from './services/impl/StubExamService';
import {MultiTabsPanelComponent} from './problem-submission-tab-panel/multi-tabs-panel.component';
import {ProblemDescriptionComponent} from './problem-description/problem-description.component';
import {CodeUploadPanelComponent} from './code-panel/code-upload-panel.component';
import {SubmissionsComponent} from './submissions/submissions.component';
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
import {CookieModule} from './services/cookie/cookie.module';
import {CookieService} from './services/cookie/cookie.service';
import {TestcasesComponent} from './testcases/testcases.component';
import {AngularSplitModule} from 'angular-split';
import {ChangePasswordComponent} from './users/change-password/change-password.component';
import {FormsModule} from '@angular/forms';
import {StompBrokerService} from './services/impl/StompBrokerService';
import {RxStompConfig} from '@stomp/rx-stomp';


const DOMAIN = 'api.judgegirl.beta.pdlab.csie.ntu.edu.tw';
const HTTP_HOST = `http://${DOMAIN}`;

const rxStompConfig = new RxStompConfig();
rxStompConfig.brokerURL = `ws://${DOMAIN}/broker`;
rxStompConfig.reconnectDelay = 200;

@NgModule({
  declarations: [
    /*Pages*/
    AppComponent,
    LoginComponent,
    ChangePasswordComponent,
    ProblemListComponent,
    ExamListComponent,
    MultiTabsPanelComponent,
    ProblemDescriptionComponent,
    CodeUploadPanelComponent,
    SubmissionsComponent,

    ExamHomeComponent,
    ExamProblemsComponent,
    ExamSubmissionsComponent,
    ExamScoreboardComponent,

    /*items*/
    LdCircleComponent,

    ProblemTagDropDownComponent,

    /*directives*/
    TestcasesComponent,
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
    HttpClient,
    MessageService,
    CookieService,
    {provide: StudentService, useClass: HttpStudentService},
    {provide: ProblemService, useClass: HttpProblemService},
    {provide: ExamService, useClass: HttpExamService},
    {provide: SubmissionService, useClass: HttpSubmissionService},
    {provide: BrokerService, useClass: StompBrokerService},
    {provide: RxStompConfig, useValue: rxStompConfig},
    {provide: 'STUDENT_SERVICE_BASE_URL', useValue: `${HTTP_HOST}`},
    {provide: 'PROBLEM_SERVICE_BASE_URL', useValue: `${HTTP_HOST}`},
    {provide: 'SUBMISSION_SERVICE_BASE_URL', useValue: `${HTTP_HOST}`},
    {provide: 'EXAM_SERVICE_BASE_URL', useValue: `${HTTP_HOST}`}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
