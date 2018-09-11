import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Conexion } from '../modelos/conexion';

@Injectable()
export class EnlacesService {

    private enlacesUrl = `${this.hostUrl}/Enlaces`;  // URL to web api simuated

    constructor(private http: HttpClient, @Inject('AUTH_API_ENDPOINT') private hostUrl: string) { }

    getEnlaceByid(id: number): Promise<Conexion> {
        const url = `${this.enlacesUrl}/${id}`;
        return this.http.get(url)
            .toPromise()
            .then(response => {
                return response as Conexion;
            })
            .catch(this.handleError);
    }

    testEnlace(enlace: Conexion): Promise<Conexion> {
        return this.http
            .post(this.enlacesUrl, JSON.stringify(enlace))
            .toPromise()
            .then(response => response as Conexion)
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error || JSON.stringify(error));
    }

}
