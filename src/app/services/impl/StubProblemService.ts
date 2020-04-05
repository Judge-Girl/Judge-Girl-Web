import {ProblemService} from '../Services';
import {Observable, Subject} from 'rxjs';
import {Problem, ProblemItem} from '../../models';

export class StubProblemService extends ProblemService {
  private readonly PSEUDO_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus,.';
  private readonly stubs: Problem[];

  constructor() {
    super();
    this.stubs = [
      new Problem(1, '8 Queens', 'Can you solve 8 queens problem?', this.PSEUDO_TEXT, this.PSEUDO_TEXT),
      new Problem(2, 'Parallelizing Merge Sort', 'Merge sort exploits divide and conquer leading itself ' +
        'to be easy to be parallelized.', this.PSEUDO_TEXT, this.PSEUDO_TEXT)
    ];
  }

  getProblemItems(page: number): Observable<ProblemItem> {
    const problemItemsSubject = new Subject<ProblemItem>();
    setTimeout(() => this.emitNextProblemItem(0, problemItemsSubject), 1000);
    return problemItemsSubject;
  }

  private emitNextProblemItem(idx: number, problemItemsSubject: Subject<ProblemItem>) {
    setTimeout(() => {
      if (idx < this.stubs.length) {
        problemItemsSubject.next(this.stubs[idx]);
        this.emitNextProblemItem(idx + 1, problemItemsSubject);
      } else {
        problemItemsSubject.complete();
      }
    }, 150);
  }

  getProblem(problemId: number): Observable<Problem> {
    const problemSubject = new Subject<Problem>();
    setTimeout(() => {
      problemSubject.next(this.stubs.find(p => p.id === problemId));
      problemSubject.complete();
    }, 700);
    return problemSubject;
  }
}
