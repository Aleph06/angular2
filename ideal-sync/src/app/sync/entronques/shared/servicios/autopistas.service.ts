import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Autopista } from '../modelos/autopista';
import { Auth2Service } from '../../../../shared/index';
import { ConstantesGlobales } from '../../../shared/utils/constantes';

@Injectable()
export class AutopistasService {

    private hostUrl: string = ConstantesGlobales.urlHost;
    private autopistasUrl = `${this.hostUrl}api/GruposEntronques`;

    constructor(private http: Http, private _authSrv: Auth2Service) { }
    getAutopistas(): Promise<Autopista[]> {
        let headers: Headers = new Headers();
        this.setHeadersGlobal(headers);
        return this.http.get(this.autopistasUrl, {
            headers: headers
        })
            .toPromise()
            .then(response => {
                return response.json() as Autopista[];
            })
            .catch(this.handleError);
    }

    getAutopistaByid(id: number): Promise<Autopista> {
        let headers: Headers = new Headers();
        this.setHeadersGlobal(headers);
        let url = `${this.autopistasUrl}/${id}`;
        return this.http.get(url, {
            headers: headers
        })
            .toPromise()
            .then(response => {
                return response.json() as Autopista;
            })
            .catch(this.handleError);
    }

    getAutopista(nombre: string) {
        return this.getAutopistas()
            .then(autopista => autopista.find(data => (data.Nombre === nombre)))
            .catch(this.handleError);
    }

    save(autopista: Autopista): Promise<Autopista> {
        if (autopista.Id > 0) {
            return this.put(autopista);
        }
        return this.post(autopista);
    }
    delete(autopista: Autopista) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.setHeadersGlobal(headers);
        let url = `${this.autopistasUrl}/${autopista.Id}`;
        return this.http
            .delete(url, { headers: headers })
            .toPromise()
            .catch(this.handleError);
    }

    private post(autopista: Autopista): Promise<Autopista> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        this.setHeadersGlobal(headers);
        return this.http
            .post(this.autopistasUrl, JSON.stringify(autopista), { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }


    private put(autopista: Autopista) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.setHeadersGlobal(headers);
        let url = `${this.autopistasUrl}/${autopista.Id}`;
        return this.http
            .put(url, JSON.stringify(autopista), { headers: headers })
            .toPromise()
            .then(() => autopista)
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
