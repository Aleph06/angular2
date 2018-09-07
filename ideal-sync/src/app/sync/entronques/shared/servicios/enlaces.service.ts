import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Conexion } from '../modelos/conexion';
import { Auth2Service } from '../../../../shared/index';
import { ConstantesGlobales } from '../../../shared/utils/constantes';

@Injectable()
export class EnlacesService {

    private hostUrl: string = ConstantesGlobales.urlHost;
    private enlacesUrl = `${this.hostUrl}api/Enlaces`;  // URL to web api simuated

    constructor(private http: Http, private _authSrv: Auth2Service) { }

    getEnlaceByid(id: number): Promise<Conexion> {
        let headers: Headers = new Headers();
        this.setHeadersGlobal(headers);
        let url = `${this.enlacesUrl}/${id}`;
        return this.http.get(url, {
            headers: headers
        })
            .toPromise()
            .then(response => {
                return response.json() as Conexion;
            })
            .catch(this.handleError);
    }

    testEnlace(enlace: Conexion): Promise<Conexion> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        this.setHeadersGlobal(headers);
        return this.http
            .post(this.enlacesUrl, JSON.stringify(enlace), { headers: headers })
            .toPromise()
            .then(response => response.json() as Conexion)
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
