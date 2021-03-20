import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {ProblemListComponent} from './problem-list/problem-list.component';
import { ExamListComponent } from './exam/exam-list/exam-list.component';
import { ExamHomeComponent } from './exam/exam-home/exam-home.component';
import { ExamProblemsComponent } from './exam/exam-problems/exam-problems.component';
import { ExamSubmissionsComponent } from './exam/exam-submissions/exam-submissions.component';
import { ExamScoreboardComponent } from './exam/exam-scoreboard/exam-scoreboard.component';
import {MultiTabsPanelComponent} from './problem-submission-tab-panel/multi-tabs-panel.component';
import {SubmissionsComponent} from './submissions/submissions.component';
import {ProblemDescriptionComponent} from './problem-description/problem-description.component';
import {TestcasesComponent} from './testcases/testcases.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'problems', component: ProblemListComponent},
  { path: 'exams', component: ExamListComponent, },
  {
    path: 'exams/:examId', component: ExamHomeComponent,
    children: [
      { path: '', component: ExamProblemsComponent, },
      { path: 'submissions', component: ExamSubmissionsComponent, },
      { path: 'scoreboard', component: ExamScoreboardComponent, },
    ],
  },
  {
    path: 'problems/:problemId', component: MultiTabsPanelComponent,
    children: [
      {path: '', component: ProblemDescriptionComponent},
      {path: 'description', component: ProblemDescriptionComponent},
      {path: 'testcases', component: TestcasesComponent},
      {path: 'submissions', component: SubmissionsComponent}]
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
