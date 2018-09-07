import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route } from '@angular/router';

import { AuthService } from '../services';
import { SessionService } from '../../session';

@Injectable()
export class LoginGuard implements CanActivate, CanActivateChild {

    constructor(private _authSrv: AuthService,
        private _ssnSrv: SessionService,
        private router: Router) {
        // console.log('LoginGuard:constructor');
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
        console.log('LoginGuard:canActivate');
        console.log('LoginGuard:canActivate', state.url);
        return Promise.resolve(this._authSrv.isLoggedOn())
            .then(isloggedOn => {
                // console.log('LoginGuard:isloggedOn', isloggedOn);
                if (isloggedOn) {
                    // console.log('LoginGuard:isAdmin', this._ssnSrv.isAdmin);
                    // if (this._ssnSrv.isAdmin) {
                    //     console.log('LoginGuard:goto', 'admin');
                    //     this.router.navigateByUrl('/admin');
                    //     console.log('LoginGuard:return', 'false');
                    //     return false;
                    // } else {
                    //     console.log('LoginGuard:goto', 'promocion');
                    //     this.router.navigateByUrl('/promocion');
                    //     console.log('LoginGuard:return', 'false');
                    //     return false;
                    // }
                    this.router.navigateByUrl('/');
                    // console.log('LoginGuard:return', 'false');
                    return false;
                } else {
                    // console.log('LoginGuard:return', 'true');
                    return true;
                }
            });
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
        console.log('LoginGuard:canActivateChild');
        return this.canActivate(route, state);
    }
}
