import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Auth2Service } from '../../../../shared/index';
import { ConstantesGlobales } from '../../../shared/utils/constantes';

@Injectable()
export class MetadatosService {

    private hostUrl: string = ConstantesGlobales.urlHost;
    private metadatossUrl = `${this.hostUrl}api/Metadatos`;  // URL to web api simuated

    constructor(private http: Http, private _authSrv: Auth2Service) { }

    getTablasDestino() {
        let headers: Headers = new Headers();
        this.setHeadersGlobal(headers);
        let url = `${this.metadatossUrl}?nombreBase=IdealRepositorioData`;
        return this.http.get(url, {
            headers: headers
        })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    getValidaConsulta(idEntronque: number, sqlquery: string) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        this.setHeadersGlobal(headers);
        let url = `${this.metadatossUrl}/SQL`;
        return this.http.post(url, JSON.stringify({ Id: idEntronque, SQL: sqlquery }), {
            headers: headers
        })
            .toPromise()
            .then(response => response.json() as string[])
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
