import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Usuario } from '../../models/domain';
import { catchError, tap, map, flatMap } from 'rxjs/operators';

/**
 * HttpService for users administration
 *
 * @export UsuariosService  Servicio de usuarios
 * @class UsuariosService
 */
@Injectable()
export class UsuariosService {

  /**
   * URLs relativas para las acciones ejecutadas por este servicio.
   *
   * @private
   * @memberof UsuariosService
   */
  private apiEndpoints = {
    getAll: 'usuarios',
    getById: 'usuarios',
    add: 'usuarios',
    update: 'usuarios',
    delete: 'usuarios',
    changePwd: 'usuarios/cpwd',
    resetPwd: 'usuarios/rpwd'
  };

  /**
   * Creates an instance of UsuariosService.
   * @param {string} apiUrl endpoint for the backend api
   * @param {HttpClient} http the httpclient service
   * @memberof UsuariosService
   */
  constructor(@Inject('AUTH_API_ENDPOINT') private apiUrl: string,
    private http: HttpClient) { }

  /**
   * Retorna la url asociada a la acción.
   *
   * @private
   * @param {string} action la accion para la que se desea obtener la url.
   * @returns la url asociada a la acción, undefined si no existe.
   * @memberof UsuariosService
   */
  private getUrl(action: string): string {
    return `${this.apiUrl}/${this.apiEndpoints[action]}`;
  }

  /**
   *
   * @returns {Observable<Usuario[]>} lista de todos los usuarios
   * @memberof UsuariosService
   */
  getAll(skipLoad = false): Observable<Usuario[]> {
    const httpOptions = skipLoad ? { headers: new HttpHeaders({ 'NV-Skip-Load': 'true' }) } : {};
    const reqUrl = `${this.getUrl('getAll')}`;
    return this.http
      .get<Usuario[]>(reqUrl, httpOptions);
  }

  /**
   *
   * @returns {Observable<Usuario[]>} lista de todos los usuarios
   * @memberof UsuariosService
   */
  findAll(top: number = 10, skipLoad = false): Observable<Usuario[]> {
    console.log('findAll');
    const httpOptions = skipLoad ? { headers: new HttpHeaders({ 'NV-Skip-Load': 'true' }) } : {};
    const selectEntr = `entronques/IdEntronque,entronques/entronque/Descripcion,entronques/entronque/Id,`;
    const selectAuth = `entronques/entronque/autopista/Nombre`;
    const reqUrl = `${this.getUrl('getAll')}?usuario&$expand=entronques/entronque/autopista&$select=Id,usuario,${selectEntr}${selectAuth}`;
    return this.http
      .get<any[]>(reqUrl, httpOptions)
      .pipe(
        map(uany => {
          return uany.map(u => <Usuario>{
            usuario: u.usuario, Id: u.Id,
            entronques: (<any[]>u.entronques).map(eany => {
              return {
                IdEntronque: eany.IdEntronque, autopista: eany.entronque.autopista,
                Descripcion: eany.entronque.Descripcion, Id: eany.entronque.Id
              };
            })
          });
        })
      );
  }

  /**
   *
   * @param {string} Id el identificador del usuario
   * @returns {Observable<Usuario>} el usuario asociado al id
   * @memberof UsuariosService
   */
  getById(Id: string): Observable<Usuario> {
    const reqUrl = `${this.getUrl('getById')}/${Id}`;
    return this.http
      .get<Usuario>(reqUrl);
  }

  /**
   *
   * @param {Usuario} usuario el usuario a agregar
   * @returns {Observable<Usuario>} los datos del usuario agregado
   * @memberof UsuariosService
   */
  add(usuario: Usuario): Observable<Usuario> {
    const reqUrl = `${this.getUrl('add')}`;
    return this.http
      .post<Usuario>(reqUrl, usuario);
  }

  /**
   *
   * @param {Usuario} usuario el usuario a actualizar
   * @returns {Observable<Usuario>} datos de usuario actualizado
   * @memberof UsuariosService
   */
  update(usuario: Usuario): Observable<Usuario> {
    const reqUrl = `${this.getUrl('update')}`;
    return this.http
      .put<Usuario>(reqUrl, usuario);
  }

  /**
   *
   * @param {string} Id identificador
   * @returns {Observable<void>} observable vacio
   * @memberof UsuariosService
   */
  delete(Id: string): Observable<void> {
    const reqUrl = `${this.getUrl('delete')}/${Id}`;
    return this.http
      .delete<void>(reqUrl);
  }

  buscaPorNombre(busqueda: string, excluir?: Array<Usuario>): Observable<Usuario[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'NV-Skip-Load': 'true'
      })
    };
    const reqUrl = `${this.getUrl('getAll')}?usuario=${busqueda}&busqueda=1`;
    return this.http.get<Usuario[]>(reqUrl, httpOptions)
      .pipe(
        map(resultados => {
          if (excluir && excluir.length > 0) {
            if (resultados.length === 1) {
              return resultados;
            } else {
              const filtrados = resultados.filter(cl => !excluir.map(cl1 => cl1.usuario).find(cl2 => cl2 === cl.usuario));
              return excluir.concat(filtrados);
            }
          } else {
            return resultados;
          }
        })
      );
  }

  buscar(busqueda: string): Observable<Usuario[]> {
    console.log('buscar', busqueda);
    return this.buscaPorNombre(busqueda, []);
  }

}
