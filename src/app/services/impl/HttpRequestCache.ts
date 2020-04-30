import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {shareReplay} from 'rxjs/operators';

export class HttpRequestCache {

  private api$Map = new Map<string, Observable<any>>();

  constructor(protected http: HttpClient) {
  }

  get<T>(url: string, httpHeaders?: HttpHeaders): Observable<T> {
    let api$ = this.api$Map.get(url) as Observable<T>;
    if (!api$) {
      api$ = this.http.get<T>(url, {
        headers: httpHeaders
      }).pipe(shareReplay(1));
      this.api$Map.set(url, api$);
    }
    return api$;
  }
}
