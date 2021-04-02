import {BrokerMessage, BrokerService} from '../Services';
import {Observable, of, Subject, Subscription} from 'rxjs';
import {RxStomp, RxStompConfig} from '@stomp/rx-stomp';
import {switchMap} from 'rxjs/operators';
import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class StompBrokerService extends BrokerService {
  connect$ = new Subject();
  previousSubscriptions = new Array<Subscription>();
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
      this.connect$.next();
    }
  }

  disconnect() {
    if (this.stompClient.active) {
      this.previousSubscriptions.map(sub => sub.unsubscribe());
      this.previousSubscriptions = [];
      this.stompClient.deactivate();
      console.log('Stomp client has been disconnected.');
    }
  }

  subscribe(topic: string, subscriber: (message: BrokerMessage) => void): void {
    if (!topic.startsWith('/')) {
      throw new Error('Topic should start with "/"');
    }
    this.connect$.subscribe(() => {
      const destination = `/topic${topic}`;
      console.log(`Subscribing destination: ${destination}...`);
      const subscription = this.stompClient.watch(destination)
        .pipe(switchMap(this.convertToBrokerMessage))
        .subscribe(subscriber);
      this.previousSubscriptions.push(subscription);
    });
  }

  convertToBrokerMessage(message): Observable<BrokerMessage> {
    console.log(`Received a STOMP Message: [${message.command}] ${message.body}`);
    return of(new BrokerMessage(message.command,
      new Map(Object.entries(message.headers)), message.body, message.isBinaryBody, message.binaryBody));
  }

}

