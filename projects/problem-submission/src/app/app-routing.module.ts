import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SubmissionsComponent} from './submissions/submissions.component';
import {ProblemDescriptionComponent} from './problem-description/problem-description.component';


const routes: Routes = [
  {path: '', component: ProblemDescriptionComponent},
  {path: 'problem', component: ProblemDescriptionComponent},
  {path: 'submissions', component: SubmissionsComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
