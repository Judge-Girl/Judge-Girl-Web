import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {StudentService} from '../services/Services';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginOnlyGuard implements CanActivate, CanActivateChild {
  constructor(private studentService: StudentService) {
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> |
    Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.guard();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.guard();
  }

  private guard(): Observable<boolean> {
    return this.studentService.tryAuthWithCurrentToken()
      .pipe(map(login => {
        if (!login) {
          this.studentService.redirectToLoginPage();
        }
        return login;
      }));
  }

}
