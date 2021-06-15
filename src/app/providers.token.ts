import {InjectionToken} from '@angular/core';
import {IdePlugin} from './ide/ide.plugin';

export const IDE_PLUGINS_PROVIDERS_TOKEN = new InjectionToken<IdePlugin[]>('IDE_PLUGINS_PROVIDERS_TOKEN');
