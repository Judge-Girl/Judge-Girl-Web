import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './login/login.component';
import {AppComponent} from './app.component';
import {ProblemListComponent} from './problem-list/problem-list.component';
import {StubLoginService} from './services/impl/StubLoginService';
import {LoginService} from './services/Services';

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
  providers: [{provide: LoginService, useClass: StubLoginService},],
  bootstrap: [AppComponent]
})
export class AppModule {
}
