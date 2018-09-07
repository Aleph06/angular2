import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Auth2Service } from '../../../../shared/index';
import { ConstantesGlobales } from '../../../shared/utils/constantes';

@Injectable()
export class ProcesosService {

    private hostUrl: string = ConstantesGlobales.urlHost;
    private procesosUrl = `${this.hostUrl}api/Procesos`;  // URL to web api simuated

    constructor(private http: Http, private _authSrv: Auth2Service) { }


    ejecutaProceso(Id: number, fecha: Date): Promise<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        this.setHeadersGlobal(headers);
        let url = `${this.procesosUrl}/OnDemand/${Id}`;
        return this.http.post(url, JSON.stringify({ Dia: fecha.getDate(), Mes: fecha.getMonth() + 1, Anio: fecha.getFullYear() }), {
            headers: headers
        })
            .toPromise()
            .then(response => response.json() as string)
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
