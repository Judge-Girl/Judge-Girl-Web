/* tslint:disable:variable-name */
import {Injectable} from '@angular/core';

import {CookieOptionsProvider} from './cookie-options-provider';
import {CookieOptions} from './cookie-options.model';
import {isBlank, isString, mergeOptions, safeDecodeURIComponent, safeJsonParse} from './utils';

declare interface Document {
  cookie: string;
}

declare const document: Document;

export interface ICookieService {
  get(key: string): string;

  getObject(key: string): object;

  getAll(): object;

  put(key: string, value: string, options?: CookieOptions): void;

  putObject(key: string, value: object, options?: CookieOptions): void;

  remove(key: string, options?: CookieOptions): void;

  removeAll(options?: CookieOptions): void;
}

@Injectable()
export class CookieService implements ICookieService {

  protected options: CookieOptions;

  protected get cookieString(): string {
    return document.cookie || '';
  }

  protected set cookieString(val: string) {
    document.cookie = val;
  }

  constructor(private _optionsProvider: CookieOptionsProvider) {
    this.options = this._optionsProvider.options;
  }

  /**
   *
   * @description
   * Returns the value of given cookie key.
   *
   * @param key Id to use for lookup.
   * @returns Raw cookie value.
   */
  get(key: string): string {
    return (this._cookieReader() as any)[key];
  }

  /**
   *
   * @description
   * Returns the deserialized value of given cookie key.
   *
   * @param key Id to use for lookup.
   * @returns Deserialized cookie value.
   */
  getObject(key: string): object {
    const value = this.get(key);
    return value ? safeJsonParse(value) : value;
  }

  /**
   *
   * @description
   * Returns a key value object with all the cookies.
   *
   * @returns All cookies
   */
  getAll(): object {
    return this._cookieReader() as any;
  }

  /**
   * @description
   * Sets a value for given cookie key.
   *
   * @param key Id for the `value`.
   * @param value Raw value to be stored.
   * @param options (Optional) Options object.
   */
  put(key: string, value: string, options?: CookieOptions) {
    this._cookieWriter()(key, value, options);
  }

  /***
   * @description
   * Serializes and sets a value for given cookie key.
   *
   * @param key Id for the `value`.
   * @param value Value to be stored.
   * @param options (Optional) Options object.
   */
  putObject(key: string, value: object, options?: CookieOptions) {
    this.put(key, JSON.stringify(value), options);
  }

  /**
   *
   * @description
   * Remove given cookie.
   *
   * @param key Id of the key-value pair to delete.
   * @param options (Optional) Options object.
   */
  remove(key: string, options?: CookieOptions): void {
    this._cookieWriter()(key, undefined, options);
  }

  /**
   *
   * @description
   * Remove all cookies.
   */
  removeAll(options?: CookieOptions): void {
    const cookies = this.getAll();
    Object.keys(cookies).forEach(key => {
      this.remove(key, options);
    });
  }

  private _cookieReader(): object {
    let lastCookies = {};
    let lastCookieString = '';
    let cookieArray: string[];
    let cookie: string;
    let i: number;
    let index: number;
    let name: string;
    const currentCookieString = this.cookieString;
    if (currentCookieString !== lastCookieString) {
      lastCookieString = currentCookieString;
      cookieArray = lastCookieString.split('; ');
      lastCookies = {};
      for (i = 0; i < cookieArray.length; i++) {
        cookie = cookieArray[i];
        index = cookie.indexOf('=');
        if (index > 0) {  // ignore nameless cookies
          name = safeDecodeURIComponent(cookie.substring(0, index));
          // the first value that is seen for a cookie is the most
          // specific one.  values for the same cookie name that
          // follow are for less specific paths.
          if (isBlank((lastCookies as any)[name])) {
            (lastCookies as any)[name] = safeDecodeURIComponent(cookie.substring(index + 1));
          }
        }
      }
    }
    return lastCookies;
  }

  private _cookieWriter() {
    const that = this;

    return (name: string, value: string, options?: CookieOptions) => {
      that.cookieString = that._buildCookieString(name, value, options);
    };
  }

  private _buildCookieString(name: string, value: string, options?: CookieOptions): string {
    const opts: CookieOptions = mergeOptions(this.options, options);
    let expires: any = opts.expires;
    if (isBlank(value)) {
      expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
      value = '';
    }
    if (isString(expires)) {
      expires = new Date(expires);
    }
    const cookieValue = opts.storeUnencoded ? value : encodeURIComponent(value);
    let str = encodeURIComponent(name) + '=' + cookieValue;
    str += opts.path ? ';path=' + opts.path : '';
    str += opts.domain ? ';domain=' + opts.domain : '';
    str += expires ? ';expires=' + expires.toUTCString() : '';
    str += opts.secure ? ';secure' : '';
    str += opts.httpOnly ? '; HttpOnly' : '';

    // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
    // - 300 cookies
    // - 20 cookies per unique domain
    // - 4096 bytes per cookie
    const cookieLength = str.length + 1;
    if (cookieLength > 4096) {
      console.log(`Cookie \'${name}\' possibly not set or overflowed because it was too large (${cookieLength} > 4096 bytes)!`);
    }
    return str;
  }
}
