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
  private readonly compilation = EXAMPLE_COMPILATION;


  constructor() {
    super();
    this.problems = [
      new Problem(1, '8 Queens', EXAMPLE_MARKDOWN_DESCRIPTION,
        [this.stubTag1, this.stubTag2],
        this.submittedCodeMetas, 'zippredProvidedCodes', this.compilation),
      new Problem(2, 'Parallelizing Merge Sort', EXAMPLE_MARKDOWN_DESCRIPTION,
        [this.stubTag2], this.submittedCodeMetas, 'zippredProvidedCodes', this.compilation),
      new Problem(3, 'Add Three Numbers', EXAMPLE_MARKDOWN_DESCRIPTION,
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


  getProblemItemsInPage(page: number): Observable<ProblemItem[]> {
    return new Observable<ProblemItem[]>(observer => {
      setTimeout(() => {
        observer.next(this.problems);
        observer.complete();
      }, 400);
      return () => {
      };
    });
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

  getProblemItemsByTag(problemTag: string): Observable<ProblemItem[]> {
    const problem$ = new Subject<Problem[]>();
    setTimeout(() => {
      problem$.next(this.problems.filter(p => p.problemTags.includes(problemTag)));
      problem$.complete();
    }, 700);
    return problem$;
  }

  getProblemTags(): Observable<string[]> {
    const problemTag$ = new Subject<string[]>();
    setTimeout(() => {
      problemTag$.next(this.problemTags);
      problemTag$.complete();
    }, 700);
    return problemTag$;
  }

  getTestCases(problemId: number): Observable<TestCase[]> {
    const testCases$ = new Subject<TestCase[]>();
    setTimeout(() => {
      testCases$.next(this.testCases);
      testCases$.complete();
    }, 700);
    return testCases$;
  }

}


export let EXAMPLE_MARKDOWN_DESCRIPTION = '<!-- Highest Discount Rate -->\n' +
  '\n' +
  '## Task Description ##\n' +
  'There is a sales coming. Every payment $p$ (a **positive integer**) will have a discount $d$ according to the following table.\n' +
  '\n' +
  '| | range of $p$ | discount $d$ |\n' +
  '|---|---|---|\n' +
  '| 1 | $0 < p < a$ | 0 |\n' +
  '| 2 | $a \\leq p < b$ | $v, \\text{ if }p\\text{ is odd}$<br><hr>$w, \\text{ if }p\\text{ is even}$ |\n' +
  '| 3 | $b \\leq p$ | $x, \\text{ if } p \\equiv 0\\ (mod\\ 3)$<br><hr>$y, ' +
  '\\text{ if }p \\equiv 1\\ (mod\\ 3)$<br><hr>$z, \\text{ if }p \\equiv 2\\ (mod\\ 3)$ |\n' +
  '\n' +
  'We define **discount rate** as $d/p$. Write a program to find the $p$ ' +
  'that has the highest discount rate. If there are multiple payments that give the highest discount rate, output the smallest one.\n' +
  '\n' +
  '## Input Format ##\n' +
  'There will be 7 lines for integers $a, b, v, w, x, y, z$.\n' +
  '\n' +
  '* $v, w, x, y, z \\geq 0$\n' +
  '* $a > 1$\n' +
  '* $b > a + 2$\n' +
  '\n' +
  '## Output Format ##\n' +
  'The smallest payment $p$ that has the highest $d/p$ discount rate.\n' +
  '\n' +
  '## Sample Input ##\n' +
  '```\n' +
  '10\n' +
  '30\n' +
  '5\n' +
  '6\n' +
  '18\n' +
  '8\n' +
  '9\n' +
  '```\n' +
  '## Sample Output ##\n' +
  '```\n' +
  '10\n' +
  '```\n' +
  '## Hint ##\n' +
  'Since we have not yet discuss the floating point numbers, ' +
  'so we compare two fractional numbers $a/b$ and $c/d$, by ' +
  'comparing $a \\* d$ and $b \\* c$ instead, when both $b$ ' +
  'and $d$ are positive integers.\n\n---\n' +
  '![Test Image](https://i.imgur.com/E9hmeDw.png)';


export let EXAMPLE_COMPILATION = new Compilation(
  'chmod +x nvprof.sh\n' +
  'nvcc -Xcompiler "-O2 -fopenmp" main.cu -o main\n' +
  './nvprof.sh ./main\n' +
  'cat nvvp.log'
);


