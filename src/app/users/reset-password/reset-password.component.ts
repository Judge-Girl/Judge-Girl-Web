import {Component, ElementRef, NgModule, OnInit, ViewChild} from '@angular/core';
import {AccountNotFoundError, IncorrectPasswordFoundError, StudentService} from '../../services/Services';
import {Router} from '@angular/router';
import {CookieService} from '../../services/cookie/cookie.service';
import { MessageService } from 'primeng';
import { NgModel } from '@angular/forms';


  interface bruh {
    current: string;
    new: string;
  }

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

  @ViewChild('spinner') spinner: ElementRef;
  @ViewChild('currentPasswordField') currentPasswordField: NgModel;
  @ViewChild('newPasswordField') newPasswordField: NgModel;

  currentPassword: string;
  newPassword: string;

  showErrorMessage: boolean;

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

  keyPress(e: KeyboardEvent) {
    if (e.key === 'Enter') this.resetPassword();
  }

  resetPassword(): void {
    this.showErrorMessage = true;
    this.errorMessage = '';

    if (this.newPasswordField.invalid || this.currentPasswordField.invalid) return;

    this.spinner.nativeElement.style.display = 'inline-block';
    this.studentService.resetPassword(this.currentPassword, this.newPassword)
      .subscribe({
        complete: () => {
          this.messageService.add({
            key: this.CHANGE_NOTIFY_KEY,
            life: 2500,
            severity: 'success',
            detail: 'Success!',
          });
          this.spinner.nativeElement.style.display = 'none';

          setTimeout(() => this.router.navigateByUrl("/"), 3000);
        },
        error: err => {
          this.spinner.nativeElement.style.display = 'none';
          if (err instanceof IncorrectPasswordFoundError) {
            this.errorMessage = 'The password is incorrect'
          } else {
            throw err;
          }
        },
      });
  }
}
