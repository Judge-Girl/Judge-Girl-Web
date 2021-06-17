import {CodeUploadPanelDecorator, CommandSet, IdePlugin} from '../ide/ide.plugin';
import {Banner} from '../ide/ide.component';
import {ExamContext} from '../contexts/ExamContext';
import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ExamOverview, getQuestion, isExamClosed, Problem} from '../models';
import {ProblemContext} from '../contexts/ProblemContext';
import {Router} from '@angular/router';


@Injectable({providedIn: 'root'})
export class ExamIdePlugin extends IdePlugin {

  constructor(private examContext: ExamContext,
              private problemContext: ProblemContext,
              private location: Location,
              private router: Router) {
    super();
  }

  get banner$(): Observable<Banner> {
    return this.whileInQuestion$
      .pipe(map(({problem, exam}) => {
        return {
          header1: `${problem.id}. ${problem.title}`,
          header2: exam.name,
          previousPageName: 'Problem Page',
          navigatePreviousPage: () => {
            this.location.back();
          }
        };
      }));
  }

  get codeUploadPanelDecorator$(): Observable<CodeUploadPanelDecorator> {
    return this.whileInQuestion$
      .pipe(map(({problem, exam}) => {
        const hideCodeUploadPanel = isExamClosed(exam) ?
          {hide: true, message: 'This exam has been closed, you can’t answer this question.'} : undefined;
        return {
          hideCodeUploadPanel,
          submitCodeButtonDecoration: {belowMessage: `Submission Quota: ${getQuestion(exam, problem.id)?.remainingQuota || 0}`}
        };
      }));
  }

  get commandSet$(): Observable<CommandSet> {
    return this.examContext.exam$.pipe(
      map((exam) => {
      return {
        goBack: () => {
          this.router.navigateByUrl(`/exams/${exam.id}`, {replaceUrl: true});
        }
      };
    }));
  }

  get whileInQuestion$(): Observable<{ problem: Problem, exam: ExamOverview }> {
    return combineLatest([this.problemContext.problem$, this.examContext.exam$])
      .pipe(map(combine => {
        const [problem, exam] = combine;
        return {problem, exam};
      }));
  }

}
