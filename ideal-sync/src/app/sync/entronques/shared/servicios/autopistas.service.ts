import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Autopista } from '../modelos/autopista';

@Injectable()
export class AutopistasService {

    private autopistasUrl = `${this.hostUrl}/GruposEntronques`;

    constructor(private http: HttpClient, @Inject('AUTH_API_ENDPOINT') private hostUrl: string) { }
    getAutopistas(): Promise<Autopista[]> {
        return this.http.get(this.autopistasUrl)
            .toPromise()
            .then(response => {
                return response as Autopista[];
            })
            .catch(this.handleError);
    }

    getAutopistaByid(id: number): Promise<Autopista> {
        const url = `${this.autopistasUrl}/${id}`;
        return this.http.get(url)
            .toPromise()
            .then(response => {
                return response as Autopista;
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
        const url = `${this.autopistasUrl}/${autopista.Id}`;
        return this.http
            .delete(url)
            .toPromise()
            .catch(this.handleError);
    }

    private post(autopista: Autopista): Promise<Autopista> {
        return this.http
            .post(this.autopistasUrl, JSON.stringify(autopista))
            .toPromise()
            .then(res => res as Autopista)
            .catch(this.handleError);
    }


    private put(autopista: Autopista) {
        const url = `${this.autopistasUrl}/${autopista.Id}`;
        return this.http
            .put(url, JSON.stringify(autopista))
            .toPromise()
            .then(() => autopista)
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.json() || error);
    }

}
