import {Injectable} from '@angular/core';
import {remove} from '../utils/arrayUtils';


@Injectable({
  providedIn: 'root'
})
export class EventBus {
  private subscribers: EventSubscriber[] = [];

  subscribe(subscriber: EventSubscriber): EventSubscription {
    this.subscribers.push(subscriber);
    return new EventBusSubscription(this, subscriber);
  }

  unsubscribe(subscriber: EventSubscriber) {
    remove(this.subscribers, subscriber);
  }

  publish(event: any) {
    this.subscribers.forEach(s => s?.onEvent(event));
  }

}

export class EventBusSubscription implements EventSubscription {
  constructor(private eventBus: EventBus, private subscriber: EventSubscriber) {
  }

  cancelSubscription() {
    this.eventBus.unsubscribe(this.subscriber);
  }

}


export interface EventSubscriber {
  onEvent(event: any);
}

export interface EventSubscription {
  cancelSubscription();
}
