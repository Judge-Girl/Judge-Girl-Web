import {GoBackCommand, IdePlugin} from '../ide/ide.plugin';
import {Banner} from '../ide/ide.component';
import {ExamContext} from '../contexts/ExamContext';
import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {ExamOverview, Problem} from '../models';
import {ProblemContext} from '../contexts/ProblemContext';

@Injectable({providedIn: 'root'})
export class ExamIdePlugin extends IdePlugin {
  private whileInExam$ = new ReplaySubject<{ problem: Problem, exam: ExamOverview }>(1);

  constructor(private examContext: ExamContext,
              private problemContext: ProblemContext,
              private location: Location,
              private route: ActivatedRoute,
              private router: Router) {
    super();
    const whileNavigateToExamPage$ = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd && e.url.includes('exams')));
    combineLatest([whileNavigateToExamPage$, problemContext.problem$, examContext.overview$])
      .subscribe((combine) => {
        const [event, problem, exam] = combine;
        if (event instanceof NavigationEnd && event.url.includes('exams')) {
          this.whileInExam$.next({problem, exam});
        }
      });
  }

  get goBack$(): Observable<GoBackCommand> {
    return this.whileInExam$
      .pipe(map(() => {
        return () => {
          this.location.back();
        };
      }));
  }

  get banner$(): Observable<Banner> {
    return this.whileInExam$
      .pipe(map(({problem, exam}) => {
        return {
          header1: `${problem.id}. ${problem.title}`,
          header2: exam.name,
          previousPageName: 'Problem Page',
          navigatePreviousPage: () => {
            this.router.navigate([`/exams/${exam.id}`], {replaceUrl: true});
          }
        };
      }));
  }

}
