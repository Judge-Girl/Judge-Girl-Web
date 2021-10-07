import {IdeCommands, IdePlugin, IdeViewModel} from './ide.plugin';
import {Injectable} from '@angular/core';
import {ProblemContext} from '../contexts/ProblemContext';
import {Params, Router} from '@angular/router';
import {NEVER, Observable, of} from 'rxjs';


@Injectable({providedIn: 'root'})
export class DefaultIdePlugin extends IdePlugin {
  constructor(private problemContext: ProblemContext,
              private router: Router) {
    super();
  }

  commands(routeParams: Params): IdeCommands {
    const problemId = +routeParams.problemId;
    return {
      goBack: () => {
        this.router.navigateByUrl(`/problems/${problemId}`, {replaceUrl: true});
      },
      getTabRoutingPrefix: () => {
        return '';
      }
    };
  }

  get viewModel$(): Observable<IdeViewModel> {
    return NEVER;
  }
}
