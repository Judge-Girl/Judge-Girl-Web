import {Problem} from '../models';
import {Injectable} from '@angular/core';
import {ResettableReplaySubject} from '../../utils/rx/my.subjects';
import {Observable} from 'rxjs';
import {ProblemService} from '../../services/Services';
import {RouteMatchingContext, RouterEvents} from './contexts';


@Injectable({
    providedIn: 'root'
  }
)
export class ProblemContext extends RouteMatchingContext<number> {
  public problem: Problem;
  private problemSubject = new ResettableReplaySubject<Problem>(1);

  constructor(protected router: RouterEvents,
              private problemService: ProblemService) {
    super(router);
    this.subscribeToRouterEvents();
  }

  matchAndExtractParams(url: string): number | undefined {
    const regex = url.match(/\/problems\/(\d+)/);
    return regex ? +regex[1] : undefined;
  }

  protected onEnterContext(problemId: number) {
    this.problemService.getProblem(problemId)
      .toPromise().then(problem => this.onProblemRetrieved(problem))
      .catch(err => this.onProblemNotFound(err));
  }

  protected onLeaveContext() {
    this.onDestroy();
  }

  onProblemRetrieved(problem: Problem) {
    this.problem = problem;
    this.problemSubject.next(problem);
  }

  onDestroy() {
    this.problem = undefined;
    this.problemSubject.reset();
  }

  onProblemNotFound(err) {
    // [TODO] Improve: error-handling, two issues
    //   (1) too many error logs in the console
    //   (2) No idea how not to initialize new subject
    this.problemSubject.error(err); // error occurs, the subject must be re-initialized
    this.problemSubject = new ResettableReplaySubject<Problem>(1);
  }

  get problem$(): Observable<Problem> {
    return this.problemSubject;
  }
}
