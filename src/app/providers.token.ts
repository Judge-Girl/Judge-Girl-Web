import {InjectionToken} from '@angular/core';
import {SubmissionContextPlugin} from './contexts/SubmissionContext';

export const SUBMISSION_CONTEXT_PLUGINS_PROVIDERS_TOKEN =
  new InjectionToken<SubmissionContextPlugin[]>('SUBMISSION_CONTEXT_PLUGINS_PROVIDERS_TOKEN');

