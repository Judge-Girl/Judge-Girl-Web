// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


import {RxStompConfig} from '@stomp/rx-stomp';

const DOMAIN = 'api.judgegirl.beta.pdlab.csie.ntu.edu.tw';
const BASE_URL = `http://${DOMAIN}`;

const rxStompConfig: RxStompConfig = {
  brokerURL: `ws://${DOMAIN}/broker`,
  reconnectDelay: 200
};

export const environment = {
  production: false,
  studentServiceBaseUrl: BASE_URL,
  problemServiceBaseUrl: BASE_URL,
  submissionServiceBaseUrl: BASE_URL,
  academyServiceBaseUrl: BASE_URL,

  rxStompConfig
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
