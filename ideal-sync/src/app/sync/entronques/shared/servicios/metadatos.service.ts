import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Injectable()
export class MetadatosService {

    private metadatossUrl = `${this.hostUrl}/Metadatos`;  // URL to web api simuated

    constructor(private http: HttpClient, @Inject('AUTH_API_ENDPOINT') private hostUrl: string) { }

    getTablasDestino(): Promise<any[]> {
        const url = `${this.metadatossUrl}?nombreBase=IdealRepositorioData`;
        return this.http.get(url)
            .toPromise()
            .then(response => response as any[])
            .catch(this.handleError);
    }

    getValidaConsulta(idEntronque: number, sqlquery: string) {
        const url = `${this.metadatossUrl}/SQL`;
        return this.http.post(url, JSON.stringify({ Id: idEntronque, SQL: sqlquery }))
            .toPromise()
            .then(response => response as string[])
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.json() || error);
    }

}
