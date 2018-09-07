import { Injectable, Inject } from '@angular/core';
import { AuthService } from 'app/shared';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../modelos/usuario';

@Injectable()
export class UsuariosService {

    private usuariosUrl = `${this.hostUrl}api/Usuarios`;

    constructor(private http: HttpClient, @Inject('AUTH_API_ENDPOINT') private hostUrl: string, private _authSrv: AuthService) { }

    getUsuarios(): Promise<Usuario[]> {
        return this.http.get<any[]>(this.usuariosUrl, )
            .toPromise()
            .then(usuariosAny => {
                const usuarios = new Array<Usuario>();
                usuariosAny.forEach(ua => {
                    const entronques = (ua['entronques'] as any[]).map(eu => eu['entronque']);
                    usuarios.push(new Usuario(+ua['Id'], ua['usuario'], entronques));
                });
                return usuarios;
            })
            .catch(this.handleError);
    }

    getUsuarioByid(id: number): Promise<Usuario> {
        const url = `${this.usuariosUrl}/${id}`;
        return this.http
            .get<any>(url)
            .toPromise()
            .then(usAny => {
                const entronques = (usAny['entronques'] as any[]).map(eu => eu['entronque']);
                return new Usuario(+usAny['Id'], usAny['usuario'], entronques);
            })
            .catch(this.handleError);
    }


    buscarUsuario(busqueda: string): Observable<Usuario[]> {
        const url = `${this.usuariosUrl}?usuario=${busqueda}&busqueda=1`;
        return this.http
            .get<Usuario[]>(url).pipe(
                map(usuariosAny => {
                    const usuarios = new Array<Usuario>();
                    usuariosAny.forEach(ua => {
                        const entronques = (ua['entronques'] as any[]).map(eu => eu['entronque']);
                        usuarios.push(new Usuario(+ua['Id'], ua['usuario'], entronques));
                    });
                    return usuarios;
                })
            );
    }

    getUsuarioByPrincipal(usuario: string): Promise<Usuario> {
        const url = `${this.usuariosUrl}?usuario=${usuario}`;
        return this.http.get<Usuario[]>(url)
            .toPromise()
            .then(usuariosAny => {
                const usuarios = new Array<Usuario>();
                if (usuariosAny.length > 0) {
                    usuariosAny.forEach(ua => {
                        const entronques = (ua['entronques'] as any[]).map(eu => eu['entronque']);
                        usuarios.push(new Usuario(+ua['Id'], ua['usuario'], entronques));
                    });
                    return usuarios[0];
                } else {
                    throw Error('No encontrado');
                }
            })
            .catch(this.handleError);
    }

    save(usuario: Usuario): Promise<Usuario> {
        if (usuario.Id > 0) {
            return this.put(usuario);
        }
        return this.post(usuario);
    }

    delete(usuario: Usuario) {
        const url = `${this.usuariosUrl}/${usuario.Id}`;
        return this.http
            .delete(url)
            .toPromise()
            .catch(this.handleError);
    }

    private post(usuario: Usuario): Promise<Usuario> {
        return this.http
            .post<Usuario>(this.usuariosUrl, JSON.stringify(usuario))
            .toPromise()
            .catch(this.handleError);
    }

    private put(usuario: Usuario) {
        const url = `${this.usuariosUrl}`;
        return this.http
            .put<Usuario>(url, usuario)
            .toPromise()
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('Error en llamada a servicio', JSON.stringify(error));
        return Promise.reject(error.json() || error);
    }
}

