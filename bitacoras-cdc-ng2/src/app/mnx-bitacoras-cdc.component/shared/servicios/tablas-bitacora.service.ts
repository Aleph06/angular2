import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { AuthService } from '../../../shared';
import { TablaBitacora } from '../modelos';

@Injectable()
export class TablasBitacoraService {

  private relativePath = 'tabbitacora';
  private fullPath: string;

  constructor(private http: Http,
    private _authsrv: AuthService,
    @Inject('apiUrl') apiUrl: string) {
    this.fullPath = `${apiUrl}${this.relativePath}`;
  }

  getAll(): Promise<TablaBitacora[]> {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    this.setHeadersGlobal(headers);
    return this.http
      .get(this.fullPath, { headers: headers })
      .toPromise()
      .then(datos =>  (datos.json() !== null ? (datos.json().bitCDCTabBitacora as TablaBitacora[]) : new Array<TablaBitacora>()))
      .catch(this.handleError);
  }

  getByConjCambios(idConjCam: number): Promise<TablaBitacora[]> {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    this.setHeadersGlobal(headers);
    let url = `${this.fullPath}/conjunto/${idConjCam}`;
    return this.http
      .get(url, { headers: headers })
      .toPromise()
      .then(datos => (datos.json() !== null ? (datos.json().bitCDCTabBitacora as TablaBitacora[]) : new Array<TablaBitacora>()))
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
