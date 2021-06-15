import {NgModule} from '@angular/core';
import {Params, RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './users/login/login.component';
import {ProblemListComponent} from './problem-list/problem-list.component';
import {ExamListComponent} from './exam/list/exam-list.component';
import {ExamHomeComponent} from './exam/home/exam-home.component';
import {ExamQuestionsComponent} from './exam/home/questions/exam-questions.component';
import {IdeComponent} from './ide/ide.component';
import {SubmissionsComponent} from './submissions/submissions.component';
import {ProblemDescriptionComponent} from './ide/problem-description/problem-description.component';
import {TestcasesComponent} from './ide/testcases/testcases.component';
import {ChangePasswordComponent} from './users/change-password/change-password.component';
import {LoginOnlyGuard} from './guard/login-only.guard';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'users/change-password', component: ChangePasswordComponent},
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
      submissionService: 'SUBMISSION_SERVICE',
      routePrefixing: () => ''
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
      submissionService: 'EXAM_QUESTION_SUBMISSION_SERVICE',
      routePrefixing: (routeParams: Params) => `/exams/${routeParams.examId}/`
    }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
