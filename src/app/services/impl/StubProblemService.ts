import {ProblemService} from '../Services';
import {Observable, Subject} from 'rxjs';
import {ProblemItem} from '../../models/Problems';

export class StubProblemService extends ProblemService {
  private stubs: ProblemItem[];

  constructor() {
    super();
    this.stubs = [
      new ProblemItem(1, '8 Queens', 'Can you solve 8 queens problem?'),
      new ProblemItem(2, 'Parallelizing Merge Sort', 'Merge sort exploits divide and conquer leading itself to be easy to be parallelized.')
    ];
  }

  getProblemItems(page: number): Observable<ProblemItem> {
    const problemItemsSubject = new Subject<ProblemItem>();
    this.emitNextProblemItem(0, problemItemsSubject);
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
    }, 800);
  }

}
