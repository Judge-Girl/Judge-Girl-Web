import {Component, OnInit} from '@angular/core';
import {AccountNotFoundError, IncorrectPasswordFoundError, StudentService} from '../services/Services';
import {Router} from '@angular/router';
import {CookieService} from '../services/cookie/cookie.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../animations.css', './login.component.css']
})
export class LoginComponent implements OnInit {
  title = 'appName';

  errorMessage = '';

  constructor(private studentService: StudentService,
              private router: Router,
              private cookieService: CookieService) {
  }

  ngOnInit(): void {
    if (this.studentService.hasLogin()) {
      this.routeToProblemListPage();
    } else {
      this.authenticateWithCookie();
    }
  }

  private authenticateWithCookie() {
    const token = this.cookieService.get(StudentService.KEY_TOKEN);
    if (token) {
      this.studentService.auth(token).toPromise()
        .then(s => {
          this.routeToProblemListPage();
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  login(studentId: string, password: string): boolean {
    console.log(`Login with studentId: ${studentId}, password: ${'*'.repeat(password.length)}`);
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'inline';
    this.studentService.login(studentId, password)
      .subscribe({
        complete: () => {
          spinner.style.display = 'none';
          this.routeToProblemListPage();
        },
        error: (err) => {
          spinner.style.display = 'none';
          if (err instanceof AccountNotFoundError) {
            this.errorMessage = 'The account is not found.';
          } else if (err instanceof IncorrectPasswordFoundError) {
            this.errorMessage = 'The password is incorrect';
          } else {
            throw err;
          }
        }
      });

    return false;  // consume the submit button
  }

  private routeToProblemListPage() {
    console.log(`Routing to the problems page.`);
    this.router.navigateByUrl('problems');
  }


}
