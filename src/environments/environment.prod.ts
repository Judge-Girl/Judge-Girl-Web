import {RxStompConfig} from '@stomp/rx-stomp';

const DOMAIN = 'api.judgegirl.beta.pdlab.csie.ntu.edu.tw';
const BASE_URL = `http://${DOMAIN}`;


const rxStompConfig: RxStompConfig = {
  brokerURL: `ws://${DOMAIN}/broker`,
  reconnectDelay: 200
};

export const environment = {
  production: true,
  studentServiceBaseUrl: BASE_URL,
  problemServiceBaseUrl: BASE_URL,
  submissionServiceBaseUrl: BASE_URL,
  academyServiceBaseUrl: BASE_URL,

  rxStompConfig
};
