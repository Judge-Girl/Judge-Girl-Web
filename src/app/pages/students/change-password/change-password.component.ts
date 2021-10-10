import {Component, ElementRef, ViewChild} from '@angular/core';
import {IncorrectPasswordFoundError, StudentService} from '../../../services/Services';
import {Router} from '@angular/router';
import {MessageService} from 'primeng';
import {NgModel} from '@angular/forms';
import {StudentContext} from '../../../contexts/StudentContext';

@Component({
  selector: 'app-login',
  templateUrl: './change-password.component.html',
  styleUrls: ['../../../../animations.css', './change-password.component.css']
})
export class ChangePasswordComponent {
  CHANGE_PASSWORD_SUCCESSFULLY_NOTIFY_KEY = 'password-change-notify';

  errorMessage = '';

  constructor(private studentService: StudentService,
              private studentContext: StudentContext,
              private router: Router,
              private messageService: MessageService) {
  }

  @ViewChild('spinner') spinner: ElementRef;
  @ViewChild('currentPasswordField') currentPasswordField: NgModel;
  @ViewChild('newPasswordField') newPasswordField: NgModel;

  currentPassword: string;
  newPassword: string;
  showErrorMessage: boolean;

  keyPress(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.changePassword();
    }
  }

  changePassword(): void {
    this.showErrorMessage = true;
    this.errorMessage = '';

    if (this.newPasswordField.invalid || this.currentPasswordField.invalid) {
      return;
    }

    this.spinner.nativeElement.style.display = 'inline-block';
    this.studentService.changePassword(this.studentContext.currentStudent.id,
      this.currentPassword, this.newPassword).toPromise()
      .then(() => {
        this.spinner.nativeElement.style.display = 'none';
        this.messageService.add({
          key: this.CHANGE_PASSWORD_SUCCESSFULLY_NOTIFY_KEY,
          life: 2500,
          severity: 'success',
          detail: 'Your password has been changed',
        });
        // return to the home page after a while
        setTimeout(() => this.router.navigateByUrl('/', {replaceUrl: true}), 2000);
      })
      .catch(err => {
          this.spinner.nativeElement.style.display = 'none';
          if (err instanceof IncorrectPasswordFoundError) {
            this.errorMessage = 'The password is incorrect';
          } else {
            throw err;
          }
        }
      );
  }
}
