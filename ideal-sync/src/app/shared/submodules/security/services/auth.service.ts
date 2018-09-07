import { Injectable, Inject } from '@angular/core';
import { Headers } from '@angular/http';
import { StoreManagement } from '../../../services';
import { SessionService } from '../../session';
import { LoginService } from '../../../services';
import { Identity } from '../../../models';

@Injectable()
export class AuthService {

    redirectUrl: string;

    constructor(private _ssnSrv: SessionService, private _loginSrv: LoginService,
        private _storeSrv: StoreManagement) {
        // console.log('AuthService:constructor');
    }

    isLoggedOn(): boolean | Promise<boolean> {
        // console.log('AuthService:isLoggedOn');
        if (this._ssnSrv.isLoggedOn) {
            if (this._ssnSrv.hasToken) {
                // console.log('AuthService:hasUser');
                if (this._ssnSrv.hasUser) {
                    return true;
                } else {
                    // console.log('AuthService:loadUser');
                    return Promise.resolve(this.loadUser());
                }
            } else {
                // console.log('AuthService:recoverToken');
                return Promise.resolve(this.recoverToken())
                    .then(recovered => {
                        if (recovered) {
                            // console.log('AuthService:loadUser');
                            return Promise.resolve(this._ssnSrv.hasUser || this.loadUser());
                        } else {
                            return recovered;
                        }
                    })
                    .catch(error => {
                        console.log('AuthService:Error:recoverToken', error);
                        return false;
                    });
            }
        } else {
            // console.log('AuthService:recoverToken');
            return Promise.resolve(this.recoverToken())
                .then(recovered => {
                    if (recovered) {
                        // console.log('AuthService:loadUser');
                        return Promise.resolve(this.loadUser());
                    } else {
                        return recovered;
                    }
                })
                .catch(error => {
                    console.log('AuthService:Error:recoverToken', error);
                    return false;
                });
        }
    }

    loadUser(): boolean | Promise<boolean> {
        // console.log('AuthService:loadUser');

        if (this._ssnSrv.hasToken) {
            return Promise.resolve(this._ssnSrv.hasUser || this._loginSrv.perfil()
                .toPromise()
                .then(principal => {
                    principal.admin = false; // (principal.rol.toUpperCase() === 'ADMINISTRADOR');
                    // console.log('AuthService:loadUser:principal', principal);
                    this._ssnSrv.principal = principal;
                    this._ssnSrv.hasUser = true;
                    // console.log('AuthService:loadUser:principal.admin', principal.admin);
                    this._ssnSrv.isAdmin = principal.admin;
                    return true;
                }).catch(error => {
                    console.log('Error:loadUser', error);
                    return false;
                }));
        } else {
            return Promise.resolve(this.recoverToken())
                .then(recovered => {
                    if (recovered) {
                        return this.loadUser();
                    } else {
                        return recovered;
                    }
                })
                .catch(error => {
                    console.log('AuthService:Error:recoverToken', error);
                    return false;
                });
        }
    }

    recoverToken(): boolean | Promise<boolean> {
        // console.log('AuthService:recoverToken');
        const savedToken = this._storeSrv.getToken();
        if (savedToken !== 'undefined' && savedToken !== null) {
            this._ssnSrv.token = savedToken;
            this._ssnSrv.hasToken = true;
            return this.isTokenValid();
        } else {
            return false;
        }
    }

    isTokenValid(): Promise<boolean> {
        // console.log('AuthService:isTokenValid');
        if (this._ssnSrv.hasToken) {
            return Promise.resolve(this._loginSrv.ping()
                .toPromise()
                .then(valid => {
                    return valid;
                }).catch(error => {
                    console.log('AuthService:Error:isTokenValid', error);
                    this._ssnSrv.token = null;
                    this._ssnSrv.hasToken = false;
                    this._storeSrv.removeToken();
                    return false;
                }));
        } else {
            return Promise.resolve(this.recoverToken())
                .then(recovered => {
                    if (recovered) {
                        return true;
                    }
                    return recovered;
                })
                .catch(error => {
                    console.log('AuthService:Error:recoverToken', error);
                    return false;
                });
        }
    }

    idAdmin(): boolean | Promise<boolean> {
        return Promise.resolve(this.isLoggedOn())
            .then(is => {
                if (is) {
                    return this._ssnSrv.isAdmin;
                } else {
                    return false;
                }
            });
    }

    login(identity: Identity): void {
        this._ssnSrv.isLoggedOn = true;
        this._storeSrv.saveToken(identity.AccessToken);
        this._ssnSrv.token = identity.AccessToken;
        this._ssnSrv.hasToken = true;
        // TODO traer usuario
        identity.admin = false; // (identity.rol.toUpperCase() === 'ADMINISTRADOR');
        this._ssnSrv.principal = identity;
        this._ssnSrv.hasUser = true;
        this._ssnSrv.isAdmin = identity.admin;
    }

    logout() {
        this._ssnSrv.isLoggedOn = false;
        this._storeSrv.removeToken();
        this._ssnSrv.token = null;
        this._ssnSrv.hasToken = false;
        this._ssnSrv.principal = null;
        this._ssnSrv.hasUser = false;
        this._ssnSrv.isAdmin = false;
    }

}
