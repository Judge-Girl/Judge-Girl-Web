import {Component, OnInit} from '@angular/core';
import {AccountNotFoundError, IncorrectPasswordFoundError, StudentService} from '../../services/Services';
import {Router} from '@angular/router';
import { AuthenticationProcedure } from 'src/app/AuthenticationProcedure';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../../animations.css', './login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage = '';

  constructor(private studentService: StudentService,
              private router: Router,
              private authenticationProcedure: AuthenticationProcedure) {
  }

  ngOnInit(): void {
    if (this.studentService.hasLogin()) {
      this.router.navigateByUrl('problems');
    } else {
      this.authenticationProcedure.authenticateWithCookie();
    }
  }

  login(email: string, password: string): boolean {
    console.log(`Login with studentId: ${email}, password: ${'*'.repeat(password.length)}`);
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'inline';
    this.studentService.login(email, password)
      .subscribe({
        complete: () => {
          spinner.style.display = 'none';
          this.router.navigateByUrl('problems');
        },
        error: (err) => {
          spinner.style.display = 'none';
          if (err instanceof AccountNotFoundError) {
            this.errorMessage = 'The email is not found.';
          } else if (err instanceof IncorrectPasswordFoundError) {
            this.errorMessage = 'The password is incorrect';
          } else {
            throw err;
          }
        }
      });

    return false;  // consume the submit button
  }

}
