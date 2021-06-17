import {NavigationEnd, Router} from '@angular/router';
import {ReplaySubject} from 'rxjs';
import {Injectable} from '@angular/core';


@Injectable({providedIn: 'root'})
export class RouterEvents {
  public events$ = new ReplaySubject<any>(1);
  constructor(private router: Router) {
    router.events.subscribe(event => this.events$.next(event));
  }
}

export abstract class Context<T> {
  abstract matchAndExtractParams(url: string): T | undefined;

  protected abstract onEnterContext(params: T);

  protected abstract onLeaveContext();
}

export abstract class RouteMatchingContext<T> extends Context<T> {
  private isInContext = false;

  protected constructor(protected router: RouterEvents) {
    super();
  }

  /**
   * The subclass must call this method at the 'end' of its constructor,
   *  as when this method is called, the events will immediately be issued.
   */
  protected subscribeToRouterEvents() {
    this.router.events$.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const params: T = this.matchAndExtractParams(event.url);
        if (params) {
          if (!this.isInContext) {
            this.isInContext = true;
            this.onEnterContext(params);
          }
        } else if (this.isInContext) {
          this.isInContext = false;
          this.onLeaveContext();
        }
      }
    });
  }

}
