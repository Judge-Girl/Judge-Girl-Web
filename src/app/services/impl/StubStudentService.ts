import {StudentService} from '../Services';
import {Observable, Subject} from 'rxjs';
import {Student} from '../../models';

export class StubStudentService extends StudentService {
  login(account: string, password: string): Observable<Student> {
    const loginSubject = new Subject<Student>();
    setTimeout(() => {
      this.currentStudent = new Student(1, account, new Date().getTime() + 144000, account);
      loginSubject.next(this.currentStudent);
      loginSubject.complete();
    }, 700);
    return loginSubject;
  }
}
