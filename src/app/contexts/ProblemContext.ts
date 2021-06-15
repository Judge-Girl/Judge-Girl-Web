import {Problem} from '../models';
import {Injectable} from '@angular/core';
import {ResettableReplaySubject} from '../../utils/rx/my.subjects';
import {Observable} from 'rxjs';


@Injectable({
    providedIn: 'root'
  }
)
export class ProblemContext {
  private problemSubject = new ResettableReplaySubject<Problem>(1);

  onProblemRetrieved(problem: Problem) {
    this.problemSubject.next(problem);
  }

  onReset() {
    this.problemSubject.reset();
  }

  onProblemNotFound(err) {
    this.problemSubject.error(err); // error occurs, the subject must be re-initialized
    this.problemSubject = new ResettableReplaySubject<Problem>(1);
  }

  get problem$(): Observable<Problem> {
    return this.problemSubject;
  }
}
