import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AccountNotFoundError, IncorrectPasswordFoundError, StudentService} from '../../services/Services';
import {Router} from '@angular/router';
import {CookieService} from '../../services/cookie/cookie.service';
import { MessageService } from 'primeng';

@Component({
  selector: 'app-login',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../../../animations.css', './reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  CHANGE_NOTIFY_KEY = 'password-change-notify';
  title = 'appName';

  errorMessage = '';

  constructor(private studentService: StudentService,
              private router: Router,
              private cookieService: CookieService,
              private messageService: MessageService) {
  }

  @ViewChild('oldPassword') oldPasswordField: ElementRef;
  @ViewChild('newPassword') newPasswordField: ElementRef;

  ngOnInit(): void {
    if (this.studentService.hasLogin()) {
      this.authenticateWithCookie();
    }
  }

  private authenticateWithCookie() {
    const token = this.cookieService.get(StudentService.KEY_TOKEN);
    if (token) {
      this.studentService.auth(token).toPromise()
        .then(s => { })
        .catch(err => {
          console.error(err);
        });
    }
  }

  resetPassword(oldPassword: string = this.oldPasswordField.nativeElement.value,
                newPassword: string = this.newPasswordField.nativeElement.value): void {
    if (!oldPassword || !newPassword) {
      this.messageService.add({
        key: this.CHANGE_NOTIFY_KEY,
        life: 2500,
        severity: 'warn',
        detail: 'Some field is blank',
      });
    }
    this.studentService.resetPassword(oldPassword, newPassword)
      .subscribe({
        complete: () => {
          this.messageService.add({
            key: this.CHANGE_NOTIFY_KEY,
            life: 2500,
            severity: 'success',
            detail: 'Success!',
          });

          setTimeout(() => this.router.navigateByUrl("/"), 3000);
        },
        error: err => {
          if (err instanceof IncorrectPasswordFoundError) {
            this.messageService.add({
              key: this.CHANGE_NOTIFY_KEY,
              life: 2500,
              severity: 'error',
              detail: 'The password is incorrect',
            });
          } else {
            throw err;
          }
        },
      });
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
