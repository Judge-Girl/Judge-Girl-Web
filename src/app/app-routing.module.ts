import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './pages/students/login/login.component';
import {ProblemListComponent} from './pages/problems/problem-list.component';
import {ExamListComponent} from './pages/exam/list/exam-list.component';
import {ExamHomeComponent} from './pages/exam/home/exam-home.component';
import {ExamQuestionsComponent} from './pages/exam/home/questions/exam-questions.component';
import {IdeComponent} from './pages/ide/ide.component';
import {SubmissionsComponent} from './pages/ide/submissions/submissions.component';
import {ProblemDescriptionComponent} from './pages/ide/problem-description/problem-description.component';
import {TestcasesComponent} from './pages/ide/testcases/testcases.component';
import {ChangePasswordComponent} from './pages/students/change-password/change-password.component';
import {LoginOnlyGuard} from './commons/guard/login-only.guard';
import {DefaultIdePlugin} from './pages/ide/ide.default.plugin';
import {ExamIdePlugin} from './pages/exam/ide.plugin';
import {ExamRootComponent} from './pages/exam/root/exam-root.component';
import {SubmissionService} from './services/Services';
import {ExamQuestionSubmissionService} from './services/impl/HttpExamQuestionSubmissionService';


const routes: Routes = [
  // Student
  {path: '', component: LoginComponent},
  {path: 'students/change-password', component: ChangePasswordComponent, canActivate: [LoginOnlyGuard]},

  // Problem
  {path: 'problems', component: ProblemListComponent},
  {
    path: 'problems/:problemId', component: IdeComponent,
    children: [
      {path: '', component: ProblemDescriptionComponent},
      {path: 'description', component: ProblemDescriptionComponent},
      {path: 'testcases', component: TestcasesComponent},
      {path: 'submissions', component: SubmissionsComponent}
    ],
    data: {
      idePluginProvider: DefaultIdePlugin,
      submissionServiceProvider: SubmissionService,
    }
  },

  // Exam
  {path: 'exams', component: ExamListComponent, canActivate: [LoginOnlyGuard]},
  {
    path: 'exams/:examId', component: ExamRootComponent, canActivate: [LoginOnlyGuard],
    children: [
      {
        path: '', component: ExamHomeComponent,
        children: [
          {path: '', component: ExamQuestionsComponent}
        ]
      },
      {
        path: 'problems/:problemId', component: IdeComponent,
        children: [
          {path: '', component: ProblemDescriptionComponent},
          {path: 'description', component: ProblemDescriptionComponent},
          {path: 'testcases', component: TestcasesComponent},
          {path: 'submissions', component: SubmissionsComponent}
        ],
        data: {
          idePluginProvider: ExamIdePlugin,
          submissionServiceProvider: ExamQuestionSubmissionService
        }
      }
    ]
  },
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
