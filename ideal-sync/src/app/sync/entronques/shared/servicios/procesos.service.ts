import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ProcesosService {

    private procesosUrl = `${this.hostUrl}/Procesos`;  // URL to web api simuated

    constructor(private http: HttpClient, @Inject('AUTH_API_ENDPOINT') private hostUrl: string) { }


    ejecutaProceso(Id: number, fecha: Date): Promise<string> {
        const url = `${this.procesosUrl}/OnDemand/${Id}`;
        return this.http.post(url, JSON.stringify({ Dia: fecha.getDate(), Mes: fecha.getMonth() + 1, Anio: fecha.getFullYear() }))
            .toPromise()
            .then(response => response as string)
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error || JSON.stringify(error));
    }

}
