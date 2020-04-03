import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './login/login.component';
import {AppComponent} from './app.component';
import {ProblemListComponent} from './problem-list/problem-list.component';
import {StubLoginService} from './services/impl/StubLoginService';
import {LoginService, ProblemService} from './services/Services';
import {StubProblemService} from './services/impl/StubProblemService';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProblemListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    {provide: LoginService, useClass: StubLoginService},
    {provide: ProblemService, useClass: StubProblemService},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
