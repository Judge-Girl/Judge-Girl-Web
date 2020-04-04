import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {ProblemListComponent} from './problem-list/problem-list.component';
import {ProblemSubmissionTabPanelComponent} from './problem-submission-tab-panel/problem-submission-tab-panel.component';
import {SubmissionsComponent} from './submissions/submissions.component';


const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'problems', component: ProblemListComponent},
  {path: 'problems/:problemId', component: ProblemSubmissionTabPanelComponent},
  {path: 'problems/:problemId:/submissions', component: SubmissionsComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
