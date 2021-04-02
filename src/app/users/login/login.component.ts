import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountNotFoundError, IncorrectPasswordFoundError, StudentService} from '../../services/Services';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../../animations.css', './login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  errorMessage = '';
  authSubscription: Subscription;

  constructor(private studentService: StudentService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.authSubscription = this.studentService.tryAuthWithCurrentToken()
      .subscribe(hasLogin => {
        if (hasLogin) {
          this.router.navigateByUrl('problems');
        }
      });
  }

  ngOnDestroy(): void {
    // it's necessary to unsubscribe it otherwise the subscriber will keep routing to /problems on every login event
    this.authSubscription.unsubscribe();
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
