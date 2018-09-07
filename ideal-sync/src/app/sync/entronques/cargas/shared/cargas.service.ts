import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Auth2Service } from '../../../../shared';
import { ConstantesGlobales } from '../../../shared/utils/constantes';

@Injectable()
export class CargasService {

    private hostUrl: string = ConstantesGlobales.urlHost;
    private cargasUrl = `${this.hostUrl}api/Upload`;

    constructor(private http: Http, private _authSrv: Auth2Service) { }

    doCarga(Id: number, nombreArchivo: string): Promise<Response> {
        let headers: Headers = new Headers();
        this.setHeadersGlobal(headers);
        let url = `${this.cargasUrl}/${Id}?nombreArchivo=${nombreArchivo}`;
        return this.http
            .put(url, JSON.stringify({}), { headers: headers })
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.json() || error);
    }

    private setHeadersGlobal(headers: Headers) {
        this._authSrv.authHeaders(headers);
    }
}
