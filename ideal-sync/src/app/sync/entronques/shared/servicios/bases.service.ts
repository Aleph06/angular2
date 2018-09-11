import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Base } from '../modelos/base';

@Injectable()
export class BasesService {

    private basesUrl = `${this.hostUrl}/Bases`;
    private filtrosUrl = `${this.hostUrl}/Filtros`;
    private mapeosUrl = `${this.hostUrl}/Mapeos`;
    private columnasUrl = `${this.hostUrl}/Columnas`;

    constructor(private http: HttpClient, @Inject('AUTH_API_ENDPOINT') private hostUrl: string) { }

    getBaseByid(id: number): Promise<Base> {
        const url = `${this.basesUrl}/${id}`;
        return this.http.get(url)
            .toPromise()
            .then(response => {
                return response as Base;
            })
            .catch(this.handleError);
    }

    save(base: Base): Promise<Base> {
        if (base.Id >= 0) {
            return this.put(base);
        }
        return this.post(base);
    }

    delete(base: Base): Promise<any> {
        const url = `${this.basesUrl}/${base.Id}`;
        return this.http
            .delete(url)
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }

    private post(base: Base): Promise<Base> {
        return this.http
            .post(this.basesUrl, base)
            .toPromise()
            .then(res => res as Base)
            .catch(this.handleError);
    }


    private put(base: Base): Promise<Base> {
        return this.http
            .put(this.basesUrl, base)
            .toPromise()
            .then(res => res as Base)
            .catch(this.handleError);
    }


    deleteFiltro(idFiltro: number): Promise<any> {
        const url = `${this.filtrosUrl}/${idFiltro}`;
        return this.http
            .delete(url)
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error || JSON.stringify(error));
    }

}
