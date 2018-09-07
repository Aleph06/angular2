import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Base } from '../modelos/index';
import { Auth2Service } from '../../../../shared/index';
import { ConstantesGlobales } from '../../../shared/utils/constantes';

@Injectable()
export class BasesService {

    private hostUrl: string = ConstantesGlobales.urlHost;
    private basesUrl = `${this.hostUrl}api/Bases`;
    private filtrosUrl = `${this.hostUrl}api/Filtros`;
    private mapeosUrl = `${this.hostUrl}api/Mapeos`;
    private columnasUrl = `${this.hostUrl}api/Columnas`;

    constructor(private http: Http, private _authSrv: Auth2Service) { }

    getBaseByid(id: number): Promise<Base> {
        let headers: Headers = new Headers();
        this.setHeadersGlobal(headers);
        let url = `${this.basesUrl}/${id}`;
        return this.http.get(url, {
            headers: headers
        })
            .toPromise()
            .then(response => {
                return response.json() as Base;
            })
            .catch(this.handleError);
    }

    save(base: Base): Promise<Base> {
        if (base.Id >= 0) {
            return this.put(base);
        }
        return this.post(base);
    }

    delete(base: Base): Promise<Response> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.setHeadersGlobal(headers);
        let url = `${this.basesUrl}/${base.Id}`;
        return this.http
            .delete(url, { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    private post(base: Base): Promise<Base> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        this.setHeadersGlobal(headers);
        return this.http
            .post(this.basesUrl, JSON.stringify(base), { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }


    private put(base: Base): Promise<Base> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.setHeadersGlobal(headers);
        return this.http
            .put(this.basesUrl, JSON.stringify(base), { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }


    deleteFiltro(idFiltro: number): Promise<Response> {
        let headers = new Headers();
        this.setHeadersGlobal(headers);
        let url = `${this.filtrosUrl}/${idFiltro}`;
        return this.http
            .delete(url, { headers: headers })
            .toPromise()
            .then(res => res)
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
