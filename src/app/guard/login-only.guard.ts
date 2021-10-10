import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {StudentContext} from '../contexts/StudentContext';

@Injectable({
  providedIn: 'root'
})
export class LoginOnlyGuard implements CanActivate, CanActivateChild {
  constructor(private studentContext: StudentContext,
              private router: Router) {
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> |
    Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.guard$;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.guard$;
  }

  private get guard$(): Observable<boolean> {
    return this.studentContext.awaitAuth$
      .pipe(map(login => {
        if (!login) {
          this.router.navigateByUrl('/');
        }
        return login;
      }));
  }

}
