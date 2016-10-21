import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { AuthService } from '../../../shared';
import { TablaOrigen } from '../modelos';

@Injectable()
export class TablasOrigenService {

  private relativePath = 'taborigen';
  private fullPath: string;

  constructor(private http: Http,
    private _authsrv: AuthService,
    @Inject('apiUrl') apiUrl: string) {
    this.fullPath = `${apiUrl}${this.relativePath}`;
  }

  getAll(): Promise<TablaOrigen[]> {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    this.setHeadersGlobal(headers);
    return this.http
      .get(this.fullPath, { headers: headers })
      .toPromise()
      .then(datos => (datos.json() !== null ? (datos.json().bitCDCTabBitacora as TablaOrigen[]) : new Array<TablaOrigen>()))
      .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('Error en llamada a servicio', JSON.stringify(error));
    return Promise.reject(JSON.stringify(error));
  }

  private setHeadersGlobal(headers: Headers) {
    this._authsrv.authHeaders(headers);
  }

}
