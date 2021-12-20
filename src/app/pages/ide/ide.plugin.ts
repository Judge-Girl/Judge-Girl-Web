import {Banner} from './ide.component';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {CodeUploadPanelDecorator} from './code-panel/code-upload-panel.component';
import {Problem} from '../../models';

export abstract class IdePlugin {
  abstract get viewModel$(): Observable<IdeViewModel>;
  abstract commands(route: ActivatedRoute): IdeCommands;
  abstract getProblem(problemId: number): Observable<Problem>;
}

export interface IdeViewModel {
  codeUploadPanelDecorator?: CodeUploadPanelDecorator;
  banner?: Banner;
}

export interface IdeCommands {
  getTabRoutingPrefix: () => string;
  goBack: () => void;
}
