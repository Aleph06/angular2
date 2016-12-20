import { Injectable, Inject } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { CookieService, CookieOptions } from 'angular2-cookie/core';

@Injectable()
export class AuthService {

    redirectUrl: string;
    isLoggedOn: boolean = false;
    hasValidRol: boolean;
    authHeader: string;
    savedCookie: string;
    isCookieValid: boolean = false;

    constructor(private _cookieSrv: CookieService,
        @Inject('authHeader') private _authHeader: string,
        @Inject('AMBIENTE') AMBIENTE: string) {
        this.authHeader = _authHeader;
        this.savedCookie = this._cookieSrv.get('_s_');
        console.log('cookie', this.savedCookie);
        if (AMBIENTE === 'DESA' && (typeof this.savedCookie === 'undefined')) {
            this._cookieSrv.put('_s_', '40BBCE8CB9E36C9CE054002128FA8F96');
            this.savedCookie = this._cookieSrv.get('_s_');
        }
        console.log('cookie', this.savedCookie);
    }

    isHeaderValid(): Observable<boolean> {
        return Observable.of(true).delay(1000).do(val => (this.authHeader !== null
            && this.authHeader !== undefined
            && (typeof this.authHeader !== 'undefined')));
    }

    isInContext(): Promise<boolean> {
        return Promise.resolve(this.isCookieValid || this.checkCookie());
    }

    checkCookie(): Promise<boolean> {
        this.isCookieValid = (this.savedCookie !== null
            && this.savedCookie !== undefined
            && (typeof this.savedCookie !== 'undefined'));
        return Promise.resolve(this.isCookieValid);
    }

    login(): Observable<boolean> {
        return Observable.of(true).delay(1000).do(val =>
            this.isLoggedOn = (this.authHeader !== null
                && this.authHeader !== undefined
                && (typeof this.authHeader !== 'undefined')));
    }

    logout(): void {
        this.isLoggedOn = false;
    }

    authHeaders(headers: Headers): Headers {
        if (!headers || headers === null) {
            headers = new Headers();
        }
        // console.log('header', this.authHeader);
        if ((typeof (this.authHeader) !== 'undefined')) {
            headers.append('Authorization', `${this.authHeader}`);
        }
        // headers.append('Cache-Control', 'not-store, no-cache');
        // headers.append('Pragma', 'no-cache');
        // headers.append('Expires', '0');
        // console.log('headers', JSON.stringify(headers));
        return headers;
    }
}
