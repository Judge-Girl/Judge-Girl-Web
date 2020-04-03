import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {ProblemListComponent} from './problem-list/problem-list.component';


const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'problems', component: ProblemListComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
