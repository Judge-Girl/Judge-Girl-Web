import {ProblemService} from '../Services';
import {Observable, Subject} from 'rxjs';
import {Compilation, Problem, ProblemItem, SubmittedCodeSpec, TestCase} from '../../models';

export class StubProblemService extends ProblemService {
  private readonly PSEUDO_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus,.';
  private readonly problems: Problem[];
  private readonly testCases: TestCase[];  // stubbing all the problems share the same test cases

  private readonly stubTag1 = 'OpenMP';
  private readonly stubTag2 = 'cUDA';
  private readonly problemTags = [this.stubTag1, this.stubTag2];
  private readonly submittedCodeMetas = [
    new SubmittedCodeSpec('c', 'function1.c'),
    new SubmittedCodeSpec('c', 'function2.c'),
  ];
  private readonly compilation = new Compilation('gcc -std=c99 -O2 -pthread prefixsum-seq.c secret.c -o prefixsum-seq');


  constructor() {
    super();
    this.problems = [
      new Problem(1, '8 Queens', '# Can you solve 8 queens problem?',
        [this.stubTag1, this.stubTag2], this.submittedCodeMetas, 'zippredProvidedCodes',
        this.compilation),
      new Problem(2, 'Parallelizing Merge Sort', '# Merge sort exploits divide and conquer leading itself ' +
        'to be easy to be parallelized.', [this.stubTag2], this.submittedCodeMetas, 'zippredProvidedCodes',
        this.compilation),
      new Problem(3, 'Add Three Numbers', '# Write a program to read three integers a, b, and c, then print their sum.',
        [this.stubTag1, this.stubTag2], this.submittedCodeMetas, 'zippredProvidedCodes',
        this.compilation)
    ];

    this.testCases = [
      new TestCase('1', 5, 5, 5000, 1, 30),
      new TestCase('2', 4, 5, 5000, 1, 30),
      new TestCase('3', 4, 4, 5000, 1, 40),
      new TestCase('Bonus', 3, 3, 5000, 1, 20),
    ];
  }


  getProblemItemsInPage(page: number): Observable<ProblemItem> {
    const problemItems$ = new Subject<ProblemItem>();
    setTimeout(() => this.emitNextProblemItem(0, problemItems$), 1000);
    return problemItems$;
  }

  private emitNextProblemItem(idx: number, problemItems$: Subject<ProblemItem>) {
    setTimeout(() => {
      if (idx < this.problems.length) {
        problemItems$.next(this.problems[idx]);
        this.emitNextProblemItem(idx + 1, problemItems$);
      } else {
        problemItems$.complete();
      }
    }, 150);
  }

  getProblem(problemId: number): Observable<Problem> {
    const problem$ = new Subject<Problem>();
    setTimeout(() => {
      for (const problem of this.problems) {
        if (problem.id === problemId) {
          problem$.next(problem);
        }
      }
      problem$.complete();
    }, 700);
    return problem$;
  }

  getProblemItemsByTag(problemTag: string): Observable<ProblemItem> {
    const problem$ = new Subject<Problem>();
    setTimeout(() => {
      for (const problem of this.problems) {
        if (problem.problemTags.includes(problemTag)) {
          problem$.next(problem);
        }
      }
      // problem$.next(this.problems.find(p =>
      //   p.problemTags.find(tag => tag === problemTag)));
      problem$.complete();
    }, 700);
    return problem$;
  }

  getProblemTags(): Observable<string> {
    const problemTag$ = new Subject<string>();
    setTimeout(() => {
      for (const problemTag of this.problemTags) {
        problemTag$.next(problemTag);
      }
      problemTag$.complete();
    }, 700);
    return problemTag$;
  }

  getTestCases(problemId: number): Observable<TestCase[]> {
    const testCases$ = new Subject<TestCase[]>();
    setTimeout( () => {
      testCases$.next(this.testCases);
      testCases$.complete();
    }, 700);
    return testCases$;
  }

}
