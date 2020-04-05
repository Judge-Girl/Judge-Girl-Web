import {Component, OnInit} from '@angular/core';
import {LoginService} from '../services/Services';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  title = 'appName';

  constructor(private loginService: LoginService,
              private router: Router) {
  }

  ngOnInit(): void {
    if (this.loginService.hasLogin) {
      this.routeToProblemListPage();
    }
  }

  login(studentId: string, password: string): boolean {
    console.log(`Login with studentId: ${studentId}, password: ${'*'.repeat(password.length)}`);
    this.loginService.login(studentId, password)
      .subscribe({
        complete: () => this.routeToProblemListPage()
      });
    return false;
  }

  private routeToProblemListPage() {
    console.log(`Routing to the problems page.`);
    this.router.navigateByUrl(`problems`);
  }


}
