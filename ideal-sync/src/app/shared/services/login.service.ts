import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Identity } from '../models';
import { Observable, of, throwError } from 'rxjs';
import { catchError, timeoutWith, map } from 'rxjs/operators';

@Injectable()
export class LoginService {

  private _relPath = {
    accessURL: '/Account/Token',
    perfilURL: '/Account/Profile',
    pingURL: '/Account/Ping',
    autorizarURL: '/Account/Autorizar'
  };

  constructor(@Inject('AUTH_API_ENDPOINT') private api: string,
    private http: HttpClient) { }

  login(identity: Identity): Observable<Identity> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    };
    const url = `${this.api}${this._relPath.accessURL}`;
    return this.http
      .post<Identity>(url, JSON.stringify(identity), httpOptions)
      .pipe(
        catchError(error => {
          const httpError = <HttpErrorResponse>error;
          if (httpError.status === 404) {
            return throwError({ message: `No se encontro el usuario,  ${identity.Usuario}` });
          } else if (httpError.status === 401) {
            return throwError({ message: 'Usuarios y/o contraseña incorrectos' });
          } else if (httpError.status === 400) {
            return throwError({ message: 'Error al procesar solicitud' });
          } else {
            return throwError(httpError.error || httpError.message);
          }
        })
      );
  }

  perfil(): Observable<Identity> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'NV-Skip-Load': 'true'
      })
    };
    const url = `${this.api}${this._relPath.perfilURL}`;
    return this.http
      .get<Identity>(url, httpOptions)
      .pipe(
        timeoutWith(3000, throwError(new Error('Request timed out'))),
        catchError(this.handleError('perfil', <Identity>null)),
    );
  }

  ping(): Observable<boolean> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'NV-Skip-Load': 'true'
      })
    };
    const url = `${this.api}${this._relPath.pingURL}`;
    return this.http
      .get<any>(url, httpOptions)
      .pipe(
        map(() => true),
        timeoutWith(3000, throwError(new Error('Request timed out'))),
        catchError(() => of(false)),
    );
  }

  autorizar(loginData: Identity, nivel = 150, app: string): Observable<boolean> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      })
    };
    let url = `${this.api}${this._relPath.autorizarURL}/${nivel}`;
    if (app && app !== null && app.length > 0) {
      url = `${this.api}${this._relPath.autorizarURL}/${nivel}/${app.toUpperCase()}`;
    }
    return this.http
      .post<boolean>(url, JSON.stringify(loginData), httpOptions)
      .pipe(
        timeoutWith(3000, throwError(new Error('Request timed out'))),
        catchError(this.handleError('autorizar', false)),
    );
  }

  resetPwd(usuario: string): Observable<string> {
    return of('correcto');
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(`${operation} failed:`, error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
