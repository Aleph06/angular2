import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, timeoutWith, map } from 'rxjs/operators';

export interface LoginData {
    user: string;
    accesskey: string;
    done: boolean;
}

export interface Identity {
    usuario: string;
    nombre: string;
    rol: string;
    nivel: number;
}

@Injectable()
export abstract class LoginService<T extends Identity> {
    /**
     * Recibe los datos de acceso y retorna una clase
     */
    abstract login(loginData: LoginData): Observable<T>;
    /**
     * Método a ejecutar si el login es existoso.
     * @param identity la identidad retornada por el servicio
     */
    abstract onLogin(identity: Identity): void;
    /**
     * Método a ejecutar si falla el login
     * @param error el error que se presentó al ejecutar el login
     */
    abstract onFail(error: any): void;
}
