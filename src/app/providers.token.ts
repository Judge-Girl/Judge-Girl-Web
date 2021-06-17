import {InjectionToken} from '@angular/core';
import {IdePlugin} from './ide/ide.plugin';
import {SubmissionContextPlugin} from './contexts/SubmissionContext';

export const IDE_PLUGINS_PROVIDERS_TOKEN = new InjectionToken<IdePlugin[]>('IDE_PLUGINS_PROVIDERS_TOKEN');
export const SUBMISSION_CONTEXT_PLUGINS_PROVIDERS_TOKEN =
  new InjectionToken<SubmissionContextPlugin[]>('SUBMISSION_CONTEXT_PLUGINS_PROVIDERS_TOKEN');
