import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Identity } from '../../../models';

@Injectable()
export class SessionService {

  private _isLoggedOn = false;
  private _hasToken = false;
  private _hasUser = false;
  private _hasSubUser = false;
  private _isAdmin = false;

  private isLoggedOnS = new Subject<boolean>();
  private hasTokenS = new Subject<boolean>();
  private hasUserS = new Subject<boolean>();
  private hasSubUserS = new Subject<boolean>();
  private isAdminS = new Subject<boolean>();

  isLoggedOn$: Observable<boolean>;
  hasToken$: Observable<boolean>;
  hasUser$: Observable<boolean>;
  hasSubUser$: Observable<boolean>;
  isAdmin$: Observable<boolean>;

  // auth props
  _principal: Identity;
  set principal(principal: Identity) {
    // console.log('set', principal);
    this._principal = principal;
  }
  get principal(): Identity {
    // console.log('get', this._principal);
    return this._principal;
  }

  token: string;

  // ui control

  private showPasswordChange = new Subject<boolean>();
  showPasswordChange$: Observable<boolean>;


  constructor() {
    this.isLoggedOn$ = this.isLoggedOnS.asObservable();
    this.hasToken$ = this.hasTokenS.asObservable();
    this.hasUser$ = this.hasUserS.asObservable();
    this.hasSubUser$ = this.hasSubUserS.asObservable();
    this.isAdmin$ = this.isAdminS.asObservable();

    this.showPasswordChange$ = this.showPasswordChange.asObservable();
  }

  set isLoggedOn(isLoggedOn: boolean) {
    this.isLoggedOnS.next(isLoggedOn);
    this._isLoggedOn = isLoggedOn;
  }

  set hasToken(hasToken: boolean) {
    this.hasTokenS.next(hasToken);
    this._hasToken = hasToken;
  }

  set hasUser(hasUser: boolean) {
    this.hasUserS.next(hasUser);
    this._hasUser = hasUser;
  }

  set isAdmin(isAdmin: boolean) {
    this.isAdminS.next(isAdmin);
    this._isAdmin = isAdmin;
  }

  get isLoggedOn(): boolean {
    return this._isLoggedOn;
  }
  get hasToken(): boolean {
    return this._hasToken;
  }
  get hasUser(): boolean {
    return this._hasUser;
  }
  get isAdmin(): boolean {
    return this._isAdmin;
  }

  isPasswordChange(is: boolean) {
    this.showPasswordChange.next(is);
  }

}
