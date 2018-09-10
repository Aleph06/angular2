import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Injectable()
export class CargasService {

    private cargasUrl = `${this.hostUrl}/Upload`;

    constructor(private http: HttpClient, @Inject('AUTH_API_ENDPOINT') private hostUrl: string) { }

    doCarga(Id: number, nombreArchivo: string): Promise<any> {
        const url = `${this.cargasUrl}/${Id}?nombreArchivo=${nombreArchivo}`;
        return this.http
            .put(url, JSON.stringify({}))
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.json() || error);
    }
}
