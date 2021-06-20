import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StudentService} from '../Services';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class AuthHttpRequestInterceptor implements HttpInterceptor {
  constructor(private studentService: StudentService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let request = req;
    if (this.studentService.currentStudent) {
      request = req.clone({
        headers:
          req.headers.append('Authorization', `Bearer ${this.studentService.currentStudent.token}`)
      });
    }
    return next.handle(request);
  }

}
