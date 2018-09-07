import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route } from '@angular/router';
import { AuthService } from '../services';
import { SessionService } from '../../session';


@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(private _authSrv: AuthService,
        private _ssnSrv: SessionService, private router: Router) {
        // console.log('AuthGuard:constructor');
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
        console.log('AuthGuard:canActivate');
        console.log('AuthGuard:canActivate', state.url);
        return Promise.resolve(this._authSrv.isLoggedOn())
            .then(isloggedOn => {
                // console.log('AuthGuard:isloggedOn', isloggedOn);
                if (isloggedOn) {
                    // console.log('AuthGuard:isAdmin', this._ssnSrv.isAdmin);
                    // if (this._ssnSrv.isAdmin) {
                    //     console.log('AuthGuard:goto', 'admin');
                    //     this.router.navigate(['admin']);
                    //     console.log('AuthGuard:return', 'false');
                    //     return false;
                    // } else {
                    //     console.log('AuthGuard:return', 'true');
                    //     return true;
                    // }
                    return true;
                } else {
                    this._authSrv.redirectUrl = state.url;
                    // console.log('AuthGuard:goto', 'login');
                    this.router.navigate(['login']);
                    // console.log('AuthGuard:return', 'false');
                    return false;
                }
            });
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
        console.log('AuthGuard:canActivateChild');
        console.log('AuthGuard:canActivateChild', state.url);
        return this.canActivate(route, state);
    }

}
