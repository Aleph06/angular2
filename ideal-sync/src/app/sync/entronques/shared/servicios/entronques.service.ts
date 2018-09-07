import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Entronque } from '../modelos/entronque';
import { Auth2Service } from '../../../../shared/index';
import { ConstantesGlobales } from '../../../shared/utils/constantes';

@Injectable()
export class EntronquesService {

    private hostUrl: string = ConstantesGlobales.urlHost;
    private entronquesUrl = `${this.hostUrl}api/Entronques`;  // URL to web api simuated

    constructor(private http: Http, private _authSrv: Auth2Service) { }

    getEntronques() {
        let headers: Headers = new Headers();
        this.setHeadersGlobal(headers);
        return this.http.get(this.entronquesUrl, {
            headers: headers
        })
            .toPromise()
            .then(response => {
                let entronques = new Array<Entronque>();
                let entronquesAny: any[] = response.json();
                entronquesAny.forEach(ea => {
                    let usuarios = (ea['usuarios'] as any[]).map(ue => ue['usuario']);
                    let entronqueTmp = ea as Entronque;
                    entronqueTmp.usuarios = usuarios;
                    entronques.push(entronqueTmp);
                });
                return entronques;
            })
            .catch(this.handleError);
    }

    getEntronqueByid(id: number) {
        let headers: Headers = new Headers();
        this.setHeadersGlobal(headers);
        let url = `${this.entronquesUrl}/${id}`;
        return this.http
            .get(url, {
                headers: headers
            }).toPromise()
            .then(resp => {
                let enAny = resp.json();
                // let usuarios = (enAny['usuarios'] as any[]).map(eu => eu['usuario']);
                let entronqueTmp = enAny as Entronque;
                // entronqueTmp.usuarios = usuarios;
                return entronqueTmp;
            })
            .catch(this.handleError);
    }

    getEntronque(nombre: string): Promise<Entronque[]> {
        let headers: Headers = new Headers();
        this.setHeadersGlobal(headers);
        let url = `${this.entronquesUrl}?$filter=Descripcion eq '${nombre}'`;
        return this.http.get(url, {
            headers: headers
        })
            .toPromise()
            .then(response => {
                let entronques = new Array<Entronque>();
                let entronquesAny: any[] = response.json();
                entronquesAny.forEach(ea => {
                    let usuarios = (ea['usuarios'] as any[]).map(ue => ue['usuario']);
                    let entronqueTmp = ea as Entronque;
                    entronqueTmp.usuarios = usuarios;
                    entronques.push(entronqueTmp);
                });
                return entronques;
            })
            .catch(this.handleError);
    }

    getEntronqueByidAutopista(idAutopista: number): Promise<Entronque[]> {
        let headers: Headers = new Headers();
        this.setHeadersGlobal(headers);
        let url = `${this.entronquesUrl}?IdGrupo=${idAutopista}`;
        return this.http.get(url, {
            headers: headers
        })
            .toPromise()
            .then(response => {
                let entronques = new Array<Entronque>();
                let entronquesAny: any[] = response.json();
                entronquesAny.forEach(ea => {
                    let usuarios = (ea['usuarios'] as any[]).map(ue => ue['usuario']);
                    let entronqueTmp = ea as Entronque;
                    entronqueTmp.usuarios = usuarios;
                    entronques.push(entronqueTmp);
                });
                return entronques;
            })
            .catch(this.handleError);
    }

    getEntronqueByidAutopistaId(idAutopista: number, id: number): Promise<Entronque> {
        let headers: Headers = new Headers();
        this.setHeadersGlobal(headers);
        let url = `${this.entronquesUrl}/${id}?IdGrupo=${idAutopista}`;
        return this.http
            .get(url, {
                headers: headers
            }).toPromise()
            .then(resp => {
                let enAny = resp.json();
                // let usuarios = (enAny['usuarios'] as any[]).map(eu => eu['usuario']);
                let entronqueTmp = enAny as Entronque;
                // entronqueTmp.usuarios = usuarios;
                return entronqueTmp;
            })
            .catch(this.handleError);
    }

    save(entronque: Entronque): Promise<Entronque> {
        entronque.baseDestino = null;
        entronque.baseOrigen = null;
        entronque.conexion = null;
        if (entronque.Id > 0) {
            return this.put(entronque);
        }
        return this.post(entronque);
    }

    delete(entronque: Entronque) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.setHeadersGlobal(headers);
        let url = `${this.entronquesUrl}/${entronque.Id}`;
        return this.http
            .delete(url, { headers: headers })
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }

    private post(entronque: Entronque): Promise<Entronque> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        this.setHeadersGlobal(headers);
        return this.http
            .post(this.entronquesUrl, JSON.stringify(entronque), { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    private put(entronque: Entronque) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.setHeadersGlobal(headers);
        let url = `${this.entronquesUrl}/${entronque.Id}`;
        return this.http
            .put(url, JSON.stringify(entronque), { headers: headers })
            .toPromise()
            .then(() => entronque)
            .catch(this.handleError);
    }

    toogleActivo(Id: number, activo: boolean): Promise<Entronque> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.setHeadersGlobal(headers);
        let url = `${this.entronquesUrl}/DActivar`;
        return this.http
            .put(url, JSON.stringify({ Id: Id, activo: activo }), { headers: headers })
            .toPromise()
            .then(resp => resp.json() as Entronque)
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
