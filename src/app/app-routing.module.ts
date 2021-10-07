import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './users/login/login.component';
import {ProblemListComponent} from './problem-list/problem-list.component';
import {ExamListComponent} from './exam/list/exam-list.component';
import {ExamHomeComponent} from './exam/home/exam-home.component';
import {ExamQuestionsComponent} from './exam/home/questions/exam-questions.component';
import {IdeComponent} from './ide/ide.component';
import {SubmissionsComponent} from './ide/submissions/submissions.component';
import {ProblemDescriptionComponent} from './ide/problem-description/problem-description.component';
import {TestcasesComponent} from './ide/testcases/testcases.component';
import {ChangePasswordComponent} from './users/change-password/change-password.component';
import {LoginOnlyGuard} from './guard/login-only.guard';
import {DefaultIdePlugin} from './ide/ide.default.plugin';
import {ExamIdePlugin} from './exam/ide.plugin';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'users/change-password', component: ChangePasswordComponent, canActivate: [LoginOnlyGuard]},
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
    }
  },
  {path: 'exams', component: ExamListComponent, canActivate: [LoginOnlyGuard]},
  {
    path: 'exams/:examId', component: ExamHomeComponent, canActivate: [LoginOnlyGuard],
    children: [
      {path: '', component: ExamQuestionsComponent},
    ],
  },
  {
    path: 'exams/:examId/problems/:problemId', component: IdeComponent, canActivate: [LoginOnlyGuard],
    children: [
      {path: '', component: ProblemDescriptionComponent},
      {path: 'description', component: ProblemDescriptionComponent},
      {path: 'testcases', component: TestcasesComponent},
      {path: 'submissions', component: SubmissionsComponent}
    ],
    data: {
      idePluginProvider: ExamIdePlugin,
    }
  },
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
