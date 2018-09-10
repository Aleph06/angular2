import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Entronque } from '../modelos/entronque';

@Injectable()
export class EntronquesService {

    private entronquesUrl = `${this.hostUrl}/Entronques`;  // URL to web api simuated

    constructor(private http: HttpClient, @Inject('AUTH_API_ENDPOINT') private hostUrl: string) { }

    getEntronques() {
        return this.http.get<any[]>(this.entronquesUrl)
            .toPromise()
            .then(response => {
                const entronques = new Array<Entronque>();
                response.forEach(ea => {
                    const usuarios = (ea['usuarios'] as any[]).map(ue => ue['usuario']);
                    const entronqueTmp = ea as Entronque;
                    entronqueTmp.usuarios = usuarios;
                    entronques.push(entronqueTmp);
                });
                return entronques;
            })
            .catch(this.handleError);
    }

    getEntronqueByid(id: number) {
        const url = `${this.entronquesUrl}/${id}`;
        return this.http
            .get<any>(url).toPromise()
            .then(resp => {
                // let usuarios = (enAny['usuarios'] as any[]).map(eu => eu['usuario']);
                const entronqueTmp = resp as Entronque;
                // entronqueTmp.usuarios = usuarios;
                return entronqueTmp;
            })
            .catch(this.handleError);
    }

    getEntronque(nombre: string): Promise<Entronque[]> {
        const url = `${this.entronquesUrl}?$filter=Descripcion eq '${nombre}'`;
        return this.http.get<any>(url)
            .toPromise()
            .then(response => {
                const entronques = new Array<Entronque>();
                response.forEach(ea => {
                    const usuarios = (ea['usuarios'] as any[]).map(ue => ue['usuario']);
                    const entronqueTmp = ea as Entronque;
                    entronqueTmp.usuarios = usuarios;
                    entronques.push(entronqueTmp);
                });
                return entronques;
            })
            .catch(this.handleError);
    }

    getEntronqueByidAutopista(idAutopista: number): Promise<Entronque[]> {
        const url = `${this.entronquesUrl}?IdGrupo=${idAutopista}`;
        return this.http.get<any[]>(url)
            .toPromise()
            .then(response => {
                const entronques = new Array<Entronque>();
                response.forEach(ea => {
                    const usuarios = (ea['usuarios'] as any[]).map(ue => ue['usuario']);
                    const entronqueTmp = ea as Entronque;
                    entronqueTmp.usuarios = usuarios;
                    entronques.push(entronqueTmp);
                });
                return entronques;
            })
            .catch(this.handleError);
    }

    getEntronqueByidAutopistaId(idAutopista: number, id: number): Promise<Entronque> {
        const url = `${this.entronquesUrl}/${id}?IdGrupo=${idAutopista}`;
        return this.http
            .get<any>(url).toPromise()
            .then(resp => {
                // let usuarios = (enAny['usuarios'] as any[]).map(eu => eu['usuario']);
                const entronqueTmp = resp as Entronque;
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
        const url = `${this.entronquesUrl}/${entronque.Id}`;
        return this.http
            .delete(url)
            .toPromise()
            .then(res => res as Response)
            .catch(this.handleError);
    }

    private post(entronque: Entronque): Promise<Entronque> {
        return this.http
            .post<Entronque>(this.entronquesUrl, JSON.stringify(entronque))
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }

    private put(entronque: Entronque) {
        const url = `${this.entronquesUrl}/${entronque.Id}`;
        return this.http
            .put<Entronque>(url, JSON.stringify(entronque))
            .toPromise()
            .then(() => entronque)
            .catch(this.handleError);
    }

    toogleActivo(Id: number, activo: boolean): Promise<Entronque> {
        const url = `${this.entronquesUrl}/DActivar`;
        return this.http
            .put<Entronque>(url, JSON.stringify({ Id: Id, activo: activo }))
            .toPromise()
            .then(resp => resp)
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.json() || error);
    }

}
