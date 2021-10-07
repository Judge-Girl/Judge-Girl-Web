import {Banner} from './ide.component';
import {Params} from '@angular/router';
import {Observable} from 'rxjs';
import {CodeUploadPanelDecorator} from './code-panel/code-upload-panel.component';

export abstract class IdePlugin {
  abstract get viewModel$(): Observable<IdeViewModel>;
  abstract commands(routeParams: Params): IdeCommands;
}

export interface IdeViewModel {
  codeUploadPanelDecorator?: CodeUploadPanelDecorator;
  banner?: Banner;
}

export interface IdeCommands {
  getTabRoutingPrefix: () => string;
  goBack: () => void;
}
