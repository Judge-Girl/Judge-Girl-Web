import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountNotFoundError, IncorrectPasswordFoundError, StudentService} from '../../../services/Services';
import {Router} from '@angular/router';
import {Subject, Subscription} from 'rxjs';
import {StudentContext} from '../../../contexts/StudentContext';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../../../animations.css', './login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  errorMessage = '';

  constructor(private studentContext: StudentContext,
              private studentService: StudentService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.studentContext.awaitAuth$
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasLogin => {
        if (hasLogin) {
          this.router.navigateByUrl('problems');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  login(email: string, password: string): boolean {
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'inline';
    this.studentService.login(email, password).toPromise()
      .then((student) => {
        this.studentContext.updateCurrentStudent(student);
        spinner.style.display = 'none';
        this.router.navigateByUrl('problems');
      })
      .catch((err) => {
        spinner.style.display = 'none';
        if (err instanceof AccountNotFoundError) {
          this.errorMessage = 'The email is not found.';
        } else if (err instanceof IncorrectPasswordFoundError) {
          this.errorMessage = 'The password is incorrect';
        } else {
          throw err;
        }
      });

    return false;  // consume the submit button
  }

}
