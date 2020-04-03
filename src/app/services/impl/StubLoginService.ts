import {LoginService} from '../Services';
import {Observable, Subject} from 'rxjs';

export class StubLoginService extends LoginService {
  login(studentId: string, password: string): Observable<any> {
    const loginSubject = new Subject();
    setTimeout(() => loginSubject.complete(), 2000);
    return loginSubject;
  }
}
