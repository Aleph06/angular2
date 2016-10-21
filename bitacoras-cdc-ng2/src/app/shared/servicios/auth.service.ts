import { Injectable, Inject } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { CookieService } from 'angular2-cookie/core';

@Injectable()
export class AuthService {

    redirectUrl: string;
    isLoggedOn: boolean = false;
    hasValidRol: boolean;
    authHeader: string;

    constructor(private _cookieSrv: CookieService,
        @Inject('authHeader') private _authHeader: string) {
        this.authHeader = _authHeader;
    }

    isHeaderValid(): Observable<boolean> {
        return Observable.of(true).delay(1000).do(val => (this.authHeader !== null
            && this.authHeader !== undefined
            && (typeof this.authHeader !== 'undefined')));
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
        if ((typeof (this.authHeader) !== 'undefined')) {
            headers.append('Authorization', `${this.authHeader}`);
        }
        return headers;
    }
}
