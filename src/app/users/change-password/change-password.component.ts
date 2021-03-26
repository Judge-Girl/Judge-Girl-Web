import {Component, ElementRef, NgModule, OnInit, ViewChild} from '@angular/core';
import {AccountNotFoundError, IncorrectPasswordFoundError, StudentService} from '../../services/Services';
import {Router} from '@angular/router';
import {CookieService} from '../../services/cookie/cookie.service';
import { MessageService } from 'primeng';
import { NgModel } from '@angular/forms';
import { AuthenticationProcedure } from 'src/app/AuthenticationProcedure';


  interface bruh {
    current: string;
    new: string;
  }

@Component({
  selector: 'app-login',
  templateUrl: './change-password.component.html',
  styleUrls: ['../../../animations.css', './change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  CHANGE_NOTIFY_KEY = 'password-change-notify';
  title = 'appName';

  errorMessage = '';

  constructor(private studentService: StudentService,
              private router: Router,
              private authenticationProcedure: AuthenticationProcedure,
              private messageService: MessageService) {
  }

  @ViewChild('spinner') spinner: ElementRef;
  @ViewChild('currentPasswordField') currentPasswordField: NgModel;
  @ViewChild('newPasswordField') newPasswordField: NgModel;

  currentPassword: string;
  newPassword: string;

  showErrorMessage: boolean;

  ngOnInit(): void {
    this.authenticationProcedure.authenticateWithCookieIfHasLogin();
  }

  keyPress(e: KeyboardEvent) {
    if (e.key === 'Enter') this.changePassword();
  }

  changePassword(): void {
    this.showErrorMessage = true;
    this.errorMessage = '';

    if (this.newPasswordField.invalid || this.currentPasswordField.invalid) return;

    this.spinner.nativeElement.style.display = 'inline-block';
    this.studentService.changePassword(this.currentPassword, this.newPassword)
      .subscribe({
        complete: () => {
          this.messageService.add({
            key: this.CHANGE_NOTIFY_KEY,
            life: 2500,
            severity: 'success',
            detail: 'Your password has been changed',
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
