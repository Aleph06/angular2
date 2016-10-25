import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import { AuthService, Base64 } from '../../../shared';
import { Filtro } from '../modelos';

@Injectable()
export class BitacorasClienteService {

    private relativePath = 'bitacoras';
    private fullPath: string;

    constructor(private http: Http,
        private _authsrv: AuthService,
        @Inject('apiUrl') apiUrl: string) {
        this.fullPath = `${apiUrl}${this.relativePath}`;
    }

    getByTablaEsquema(tabla: string, esquema: string): Promise<any[]> {
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        this.setHeadersGlobal(headers);
        let url = `${this.fullPath}/${esquema}/${tabla}`;
        return this.http
            .get(url, { headers: headers })
            .toPromise()
            .then(datos => (datos.json() !== null ? datos.json() : new Array<any>()))
            .catch(this.handleError);
    }

    /**
     * 
     * 
     * @private
     * @param {*} error
     * @returns
     * 
     * @memberOf BitacorasClienteService
     */
    private handleError(error: any) {
        console.error('Error en llamada a servicio', JSON.stringify(error));
        return Promise.reject(JSON.stringify(error));
    }

    /**
     * 
     * 
     * @private
     * @param {Headers} headers
     * 
     * @memberOf BitacorasClienteService
     */
    private setHeadersGlobal(headers: Headers) {
        this._authsrv.authHeaders(headers);
    }

}
