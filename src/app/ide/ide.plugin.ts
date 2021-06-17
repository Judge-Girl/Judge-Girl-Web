import {Banner} from './ide.component';
import {Inject, Injectable} from '@angular/core';
import {Observable, race} from 'rxjs';
import {IDE_PLUGINS_PROVIDERS_TOKEN} from '../providers.token';

export abstract class IdePlugin {
  abstract get codeUploadPanelDecorator$(): Observable<CodeUploadPanelDecorator>;

  abstract get commandSet$(): Observable<CommandSet>;

  abstract get banner$(): Observable<Banner>;
}

export interface CommandSet {
  goBack(): void;
}

export interface CodeUploadPanelDecorator {
  hideCodeUploadPanel?: { hide: boolean, message?: string };
  submitCodeButtonDecoration?: { belowMessage?: string };
}

@Injectable({
    providedIn: 'root'
  }
)
export class IdePluginChain {
  constructor(@Inject(IDE_PLUGINS_PROVIDERS_TOKEN) private readonly providers: Array<IdePlugin>) {
  }

  get codeUploadPanelDecorator$(): Observable<CodeUploadPanelDecorator> {
    return race(...this.providers.map(p => p.codeUploadPanelDecorator$));
  }

  get commandSet$(): Observable<CommandSet> {
    return race(...this.providers.map(p => p.commandSet$));
  }

  get banner$(): Observable<Banner> {
    return race(...this.providers.map(p => p.banner$));
  }
}
