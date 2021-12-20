import {IdeCommands, IdePlugin, IdeViewModel} from './ide.plugin';
import {Injectable} from '@angular/core';
import {ProblemContext} from '../../contexts/ProblemContext';
import {ActivatedRoute, Router} from '@angular/router';
import {NEVER, Observable} from 'rxjs';
import {Problem} from '../../models';
import {ProblemService} from '../../services/Services';


@Injectable({providedIn: 'root'})
export class DefaultIdePlugin extends IdePlugin {
  constructor(private problemContext: ProblemContext,
              private problemService: ProblemService,
              private router: Router) {
    super();
  }

  commands(route: ActivatedRoute): IdeCommands {
    return {
      goBack: () => {
        this.router.navigateByUrl(`/problems`, {replaceUrl: true});
      },
      getTabRoutingPrefix: () => {
        return '';
      }
    };
  }

  get viewModel$(): Observable<IdeViewModel> {
    return NEVER;
  }

  getProblem(problemId: number): Observable<Problem> {
    return this.problemService.getProblem(problemId);
  }
}
