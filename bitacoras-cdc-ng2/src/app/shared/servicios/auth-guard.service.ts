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
    console.log(this.authService.isLoggedOn);
    if (this.authService.isLoggedOn) {
      return true;
    } else {
      return this.authService.login().toPromise().then(() => {
        console.log(this.authService.isLoggedOn);
        if (!this.authService.isLoggedOn) {
          this.router.navigate(['/noautorizado']);
        }
        return this.authService.isLoggedOn;
      }).catch(err => { console.log('Err', err); return false; });
    }
  }
}
