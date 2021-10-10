import {IdeCommands, IdePlugin, IdeViewModel} from '../ide/ide.plugin';
import {ExamContext} from '../../contexts/ExamContext';
import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {findQuestion, isExamClosed} from '../../models';
import {ProblemContext} from '../../contexts/ProblemContext';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class ExamIdePlugin extends IdePlugin {
  constructor(private examContext: ExamContext,
              private problemContext: ProblemContext,
              private location: Location,
              private router: Router) {
    super();
  }

  commands(route: ActivatedRoute): IdeCommands {
    const examId: number = +route.parent.snapshot.paramMap.get('examId');
    return {
      getTabRoutingPrefix: () => {
        return `/exams/${examId}/`;
      },
      goBack: () => {
        this.router.navigateByUrl(`/exams/${examId}`, {replaceUrl: true});
      }
    };
  }

  get viewModel$(): Observable<IdeViewModel> {
    return combineLatest([this.examContext.exam$, this.problemContext.problem$])
      .pipe(map(combine => {
        const [exam, problem] = combine;
        const hideCodeUploadPanel = isExamClosed(exam) ?
          {hide: true, message: 'This exam has been closed, you can’t answer this question.'} : undefined;
        return {
          banner: {
            header1: `${problem.id}. ${problem.title}`,
            header2: exam.name,
            previousPageName: 'Problem Page',
            navigatePreviousPage: () => {
              this.location.back();
            }
          }, codeUploadPanelDecorator: {
            hideCodeUploadPanel,
            submitCodeButtonDecoration: {belowMessage: `Submission Quota: ${findQuestion(exam, problem.id)?.remainingQuota || 0}`}
          }
        };
      }));
  }
}
