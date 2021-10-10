import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {StudentContext} from '../../app/contexts/StudentContext';

@Injectable({providedIn: 'root'})
export class AuthHttpRequestInterceptor implements HttpInterceptor {
  constructor(private studentContext: StudentContext) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let request = req;
    if (this.studentContext.currentStudent) {
      request = req.clone({
        headers:
          req.headers.append('Authorization', `Bearer ${this.studentContext.currentStudent.token}`)
      });
    }
    return next.handle(request);
  }

}
