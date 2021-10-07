import {Problem} from '../models';
import {Injectable} from '@angular/core';
import {ResettableReplaySubject} from '../../utils/rx/my.subjects';
import {Observable} from 'rxjs';
import {ProblemService} from '../../services/Services';


@Injectable({
    providedIn: 'root'
  }
)
export class ProblemContext {
  private problemSubject = new ResettableReplaySubject<Problem>(1);

  constructor(private problemService: ProblemService) {
  }

  get problem$(): Observable<Problem> {
    return this.problemSubject;
  }

  init(problemId: number) {
    this.problemService.getProblem(problemId)
      .toPromise().then(problem => this.initializeProblem(problem))
      .catch(err => this.onProblemNotFound(err));
  }

  private initializeProblem(problem: Problem) {
    this.problemSubject.next(problem);
  }

  onProblemNotFound(err) {
    // [TODO] Improve: error-handling, two issues
    //   (1) too many error logs in the console
    //   (2) No idea how not to initialize new subject
    this.problemSubject.error(err); // error occurs, the subject must be re-initialized
    this.problemSubject = new ResettableReplaySubject<Problem>(1);
  }

  destroy() {
    this.problemSubject.reset();
    this.problemSubject = new ResettableReplaySubject();
  }
}
