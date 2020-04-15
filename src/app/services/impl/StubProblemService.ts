import {ProblemService} from '../Services';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Compilation, Problem, ProblemItem, SubmittedCodeMeta} from '../../models';

export class StubProblemService extends ProblemService {
  private readonly PSEUDO_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus,.';
  private readonly problems: Problem[];

  private readonly stubTag1 = 'OpenMP';
  private readonly stubTag2 = 'cUDA';
  private readonly problemTags = [this.stubTag1, this.stubTag2];
  private readonly submittedCodeMetas = [
    new SubmittedCodeMeta('c', 'function1.c'),
    new SubmittedCodeMeta('c', 'function2.c'),
  ];
  private readonly compilation = new Compilation('gcc -std=c99 -O2 -pthread prefixsum-seq.c secret.c -o prefixsum-seq');

  private currentProblemSubject: BehaviorSubject<Problem>;

  constructor() {
    super();
    this.problems = [
      new Problem(1, '8 Queens', '# Can you solve 8 queens problem?',
        [this.stubTag1, this.stubTag2], this.submittedCodeMetas, 'zippredProvidedCodes',
        this.compilation),
      new Problem(2, 'Parallelizing Merge Sort', '# Merge sort exploits divide and conquer leading itself ' +
        'to be easy to be parallelized.', [this.stubTag1, this.stubTag2], this.submittedCodeMetas, 'zippredProvidedCodes',
        this.compilation),
      new Problem(3, 'Add Three Numbers', '# Write a program to read three integers a, b, and c, then print their sum.',
        [this.stubTag1, this.stubTag2], this.submittedCodeMetas, 'zippredProvidedCodes',
        this.compilation),
      new Problem(4, 'Surface Area and Volume of a Box',
        '# Write a program to compute the surface area and the volume of this box.',
        [this.stubTag1, this.stubTag2], this.submittedCodeMetas, 'zippredProvidedCodes',
        this.compilation),
    ];
  }

  set currentProblemId(id: number) {
    this._currentProblemId = id;
  }

  getProblemItemsInPage(page: number): Observable<ProblemItem> {
    const problemItemsSubject = new Subject<ProblemItem>();
    setTimeout(() => this.emitNextProblemItem(0, problemItemsSubject), 1000);
    return problemItemsSubject;
  }

  private emitNextProblemItem(idx: number, problemItemsSubject: Subject<ProblemItem>) {
    setTimeout(() => {
      if (idx < this.problems.length) {
        problemItemsSubject.next(this.problems[idx]);
        this.emitNextProblemItem(idx + 1, problemItemsSubject);
      } else {
        problemItemsSubject.complete();
      }
    }, 150);
  }

  getProblem(problemId: number): Observable<Problem> {
    const problemSubject = new Subject<Problem>();
    setTimeout(() => {
      problemSubject.next(this.problems.find(p => p.id === problemId));
      problemSubject.complete();
    }, 700);
    return problemSubject;
  }

  getProblemItemsByTag(problemTag: string): Observable<ProblemItem> {
    const problemSubject = new Subject<Problem>();
    setTimeout(() => {
      problemSubject.next(this.problems.find(p =>
        p.problemTags.find(tag => tag === problemTag)));
      problemSubject.complete();
    }, 700);
    return problemSubject;
  }

  getProblemTags(): Observable<string> {
    const problemTagSubject = new Subject<string>();
    setTimeout(() => {
      for (const problemTag of this.problemTags) {
        problemTagSubject.next(problemTag);
      }
      problemTagSubject.complete();
    }, 700);
    return problemTagSubject;
  }

  getCurrentProblem(): Observable<Problem> {
    return undefined;
  }
}
