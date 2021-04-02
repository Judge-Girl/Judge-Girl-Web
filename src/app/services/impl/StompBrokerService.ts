import {BrokerMessage, BrokerService} from '../Services';
import {Observable, of} from 'rxjs';
import {RxStomp, RxStompConfig} from '@stomp/rx-stomp';
import {switchMap} from 'rxjs/operators';
import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class StompBrokerService extends BrokerService {
  stompClient: RxStomp = new RxStomp();

  constructor(private stompConfig: RxStompConfig) {
    super();
  }

  connect() {
    if (this.stompClient.active) {
      console.log('Stomp client has been connected.');
    } else {
      this.stompClient.configure(this.stompConfig);
      this.stompClient.activate();
    }
  }

  watch(topic: string): Observable<BrokerMessage> {
    if (!topic.startsWith('/')) {
      throw new Error('Topic should start with "/"');
    }
    const destination = `/topic${topic}`;
    const message$ = this.stompClient.watch(destination);

    return message$.pipe(switchMap(this.convertToBrokerMessage));
  }

  convertToBrokerMessage(message): Observable<BrokerMessage> {
    console.log(`STOMP Message: [{}] {}`, message.command, message.isBinaryBody ? 'binary' : message.body);
    return of(new BrokerMessage(message.command,
      new Map(Object.entries(message.headers)), message.body, message.isBinaryBody, message.binaryBody));
  }

}

