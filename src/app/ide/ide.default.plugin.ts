import {CodeUploadPanelDecorator, CommandSet, IdePlugin} from './ide.plugin';
import {Banner} from './ide.component';
import {Injectable} from '@angular/core';
import {NEVER, Observable} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {ProblemContext} from '../contexts/ProblemContext';
import {Router} from '@angular/router';


const YIELDING_DELAY = 10;

@Injectable({providedIn: 'root'})
export class DefaultIdePlugin extends IdePlugin {

  constructor(private problemContext: ProblemContext,
              private router: Router) {
    super();
  }

  get banner$(): Observable<Banner> {
    return NEVER;
  }

  get codeUploadPanelDecorator$(): Observable<CodeUploadPanelDecorator> {
    return NEVER;
  }

  get commandSet$(): Observable<CommandSet> {
    return this.problemContext.problem$
      .pipe(delay(YIELDING_DELAY),
        map((problem) => {
          return {
            goBack: () => {
              this.router.navigateByUrl(`/problems/${problem.id}`, {replaceUrl: true});
            }
          };
        }));
  }

}
