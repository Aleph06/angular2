import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route } from '@angular/router';
import { AuthService } from '../services';
import { SessionService } from '../../session';

@Injectable()
export class RolGuard implements CanActivate, CanActivateChild {
    constructor(private _authSrv: AuthService,
        private _ssnSrv: SessionService,
        private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
        console.log('RolGuard:canActivate');
        console.log('RolGuard:canActivate', state.url);
        return Promise.resolve(this._authSrv.isLoggedOn())
            .then(isloggedOn => {
                // console.log('AdminGuard:isloggedOn', isloggedOn);
                if (isloggedOn) {
                    const roles = route.data['roles'] as Array<string>;
                    // console.log('RolGuard:rolesAllowed', roles);
                    let hasAccess = true;
                    if (roles && roles.length > 0) {
                        hasAccess = roles.includes(this._ssnSrv.principal.rol);
                    }
                    // console.log('hasAccess', hasAccess);
                    if (hasAccess) {
                        // console.log('AdminGuard:return', 'true');
                        return true;
                    } else {
                        // console.log('AdminGuard:goto', 'noautorizado');
                        this.router.navigate(['noautorizado']);
                        // console.log('AdminGuard:return', 'false');
                        return false;
                    }
                } else {
                    // console.log('AdminGuard:goto', 'login');
                    this.router.navigate(['login']);
                    // console.log('AdminGuard:return', 'false');
                    return false;
                }
            });
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
        console.log('RolGuard:canActivateChild');
        return this.canActivate(route, state);
    }

}
