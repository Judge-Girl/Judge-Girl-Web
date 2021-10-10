import {IdeCommands, IdePlugin, IdeViewModel} from './ide.plugin';
import {Injectable} from '@angular/core';
import {ProblemContext} from '../../contexts/ProblemContext';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NEVER, Observable, of} from 'rxjs';


@Injectable({providedIn: 'root'})
export class DefaultIdePlugin extends IdePlugin {
  constructor(private problemContext: ProblemContext,
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
}
