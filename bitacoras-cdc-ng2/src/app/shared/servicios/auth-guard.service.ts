import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
    let url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean | Promise<boolean> {
    console.log(this.authService.isCookieValid);
    if (this.authService.isCookieValid) {
      return true;
    } else {
      return this.authService.isInContext()
        .then(inContext => {
          if (!inContext) {
            this.router.navigate(['noautorizado']);
          }
          return inContext;
        })
        .catch(err => { console.log('Err', err); this.router.navigate(['errorinterno']); return false; });
    }
  }
}
