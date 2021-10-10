import {Observable, ReplaySubject, SchedulerLike, Subject} from 'rxjs';
import {startWith, switchMap} from 'rxjs/operators';

// Reference: https://stackoverflow.com/questions/51145664/resetting-replaysubject-in-rxjs-6/51147023
// @usage To create a resettable:
// `ReplaySubject: resettable(() => new ReplaySubject<Problem>(1))`
export class ResettableReplaySubject<T> extends ReplaySubject<T> {

  reset: () => void;

  constructor(bufferSize?: number, windowTime?: number, scheduler?: SchedulerLike) {
    super(bufferSize, windowTime, scheduler);
    const resettable = this.resettable(() => new ReplaySubject<T>(bufferSize, windowTime, scheduler));

    Object.keys(resettable.subject).forEach(key => {
      this[key] = resettable.subject[key];
    });

    Object.keys(resettable.observable).forEach(key => {
      this[key] = resettable.observable[key];
    });

    this.reset = resettable.reset;
  }

  private resettable<S>(factory: () => Subject<S>): {
    observable: Observable<S>,
    subject: Subject<S>,
    reset(): void,
  } {
    const resetter = new Subject<any>();
    const source = new Subject<S>();
    let destination = factory();
    let subscription = source.subscribe(destination);
    return {
      observable: resetter.asObservable().pipe(
        startWith(null),
        switchMap(() => destination)
      ) as Observable<S>,
      reset: () => {
        subscription.unsubscribe();
        destination = factory();
        subscription = source.subscribe(destination);
        resetter.next();
      },
      subject: source,
    };
  }
}
