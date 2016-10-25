import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { AuthService } from '../../../shared';
import { ConjuntoDeCambios } from '../modelos';

@Injectable()
export class ConjuntosDeCambiosService {

  private relativePath = 'conjcambios';
  private fullPath: string;

  constructor(private http: Http,
    private _authsrv: AuthService,
    @Inject('apiUrl') apiUrl: string) {
    this.fullPath = `${apiUrl}${this.relativePath}`;
  }

  getAll(): Promise<ConjuntoDeCambios[]> {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    this.setHeadersGlobal(headers);
    return this.http
      .get(this.fullPath, { headers: headers })
      .toPromise()
      .then(datos => (datos.json() !== null ? (datos.json().bitCDCConjCambios as ConjuntoDeCambios[]) : new Array<ConjuntoDeCambios>()))
      .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('Error en llamada a servicio', error);
    error.Message = 'Error en llamada a servicio';
    return Promise.reject(error);
  }

  private setHeadersGlobal(headers: Headers) {
    this._authsrv.authHeaders(headers);
  }

}
