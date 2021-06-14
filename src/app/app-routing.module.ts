import {NgModule} from '@angular/core';
import {Params, RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './users/login/login.component';
import {ProblemListComponent} from './problem-list/problem-list.component';
import {ExamListComponent} from './exam/exam-list/exam-list.component';
import {ExamHomeComponent} from './exam/exam-home/exam-home.component';
import {ExamQuestionsComponent} from './exam/exam-questions/exam-questions.component';
import {IdeComponent} from './ide/ide.component';
import {SubmissionsComponent} from './submissions/submissions.component';
import {ProblemDescriptionComponent} from './ide/problem-description/problem-description.component';
import {TestcasesComponent} from './testcases/testcases.component';
import {ChangePasswordComponent} from './users/change-password/change-password.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'users/change-password', component: ChangePasswordComponent},
  {path: 'problems', component: ProblemListComponent},
  {path: 'exams/:examId/questions/:questionId', component: IdeComponent},
  {path: 'exams', component: ExamListComponent},
  {
    path: 'exams/:examId', component: ExamHomeComponent,
    children: [
      {path: '', component: ExamQuestionsComponent},
    ],
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
      submissionService: 'SUBMISSION_SERVICE',
      routePrefixing: () => ''
    }
  },
  {
    path: 'exams/:examId/problems/:problemId', component: IdeComponent,
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
