import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route } from '@angular/router';
import { AuthService } from '../services';
import { SessionService } from '../../session';

@Injectable()
export class AdminGuard implements CanActivate, CanActivateChild {
    constructor(private _authSrv: AuthService,
        private _ssnSrv: SessionService,
        private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
        console.log('AdminGuard:canActivate');
        console.log('AdminGuard:canActivate', state.url);
        return Promise.resolve(this._authSrv.isLoggedOn())
            .then(isloggedOn => {
                // console.log('AdminGuard:isloggedOn', isloggedOn);
                if (isloggedOn) {
                    // console.log('AdminGuard:isAdmin', this._ssnSrv.isAdmin);
                    // console.log('AdminGuard:adminForApp', adminForApp);
                    if (this._ssnSrv.isAdmin) {
                        // console.log('AdminGuard:return', 'true');
                        return true;
                    } else {
                        console.log('AdminGuard:goto', 'noautorizado');
                        this.router.navigate(['noautorizado']);
                        // console.log('AdminGuard:return', 'false');
                        return false;
                    }
                } else {
                    console.log('AdminGuard:goto', 'login');
                    this.router.navigate(['login']);
                    // console.log('AdminGuard:return', 'false');
                    return false;
                }
            });
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
        console.log('AdminGuard:canActivateChild');
        return this.canActivate(route, state);
    }

}
