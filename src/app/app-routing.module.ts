import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {ProblemListComponent} from './problem-list/problem-list.component';
import {TabPanelComponent} from './problem-submission-tab-panel/tab-panel.component';
import {SubmissionsComponent} from './submissions/submissions.component';
import {ProblemDescriptionComponent} from './problem-description/problem-description.component';
import {TestcasesComponent} from './testcases/testcases.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'problems', component: ProblemListComponent},
  {
    path: 'problems/:problemId', component: TabPanelComponent,
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
