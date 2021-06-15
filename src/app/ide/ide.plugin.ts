import {Banner} from './ide.component';
import {Inject, Injectable} from '@angular/core';
import {merge, Observable} from 'rxjs';
import {IDE_PLUGINS_PROVIDERS_TOKEN} from '../providers.token';

export type GoBackCommand = () => void;

export abstract class IdePlugin {
  abstract get goBack$(): Observable<GoBackCommand>;

  abstract get banner$(): Observable<Banner>;
}

@Injectable({
    providedIn: 'root'
  }
)
export class IdePluginChain {
  constructor(@Inject(IDE_PLUGINS_PROVIDERS_TOKEN) private readonly providers: Array<IdePlugin>) {
  }

  get goBack$(): Observable<GoBackCommand> {
    return merge(...this.providers.map(p => p.goBack$));
  }

  get banner$(): Observable<Banner> {
    return merge(...this.providers.map(p => p.banner$));
  }
}
