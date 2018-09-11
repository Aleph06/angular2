import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Usuario } from '../../models/domain';
import { catchError, tap, map, flatMap } from 'rxjs/operators';

@Injectable()
export class PermisosUsuarioService {

    private permisosUrl = `${this.hostUrl}/EntronquesUsuarios`;

    constructor(private http: HttpClient, @Inject('AUTH_API_ENDPOINT') private hostUrl: string) { }

    getPermisosUsuarioByidEntronque(IdEntronque: number): Promise<any[]> {
        const url = `${this.permisosUrl}?IdEntronque=${IdEntronque}`;
        return this.http.get<any[]>(url)
            .toPromise()
            .then(usrany => {
                return usrany.map(usr => usr.usuario);
            })
            .catch(this.handleError);
    }

    delete(idUsuario: number, idEntronque: number): Promise<any> {
        const url = `${this.permisosUrl}?IdEntronque=${idEntronque}&IdUsuario=${idUsuario}`;
        return this.http
            .delete(url)
            .toPromise().then(r => r)
            .catch(this.handleError);
    }

    add(idUsuario: number, idEntronque: number): Promise<any> {
        return this.http
            .post(this.permisosUrl, { Id: 0, IdEntronque: idEntronque, IdUsuario: idUsuario })
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }

    grantAll(idUsuario: number): Promise<any> {
        const url = `${this.permisosUrl}/GrantAll/${idUsuario}`;
        return this.http
            .put(url, '')
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error || JSON.stringify(error));
    }

}
