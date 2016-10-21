import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import { AuthService } from '../../../shared';
import { Filtro } from '../modelos';

@Injectable()
export class BitacorasService {

  private relativePath = 'bitacoras';
  private fullPath: string;

  constructor(private http: Http,
    private _authsrv: AuthService,
    @Inject('apiUrl') apiUrl: string) {
    this.fullPath = `${apiUrl}${this.relativePath}`;
  }

  getByTablaEsquema(tabla: string, esquema: string): Promise<any[]> {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    this.setHeadersGlobal(headers);
    let url = `${this.fullPath}/${esquema}/${tabla}`;
    return this.http
      .get(url, { headers: headers })
      .toPromise()
      .then(datos => (datos.json() !== null ? datos.json() : new Array<any>()))
      .catch(this.handleError);
  }

  getByTablaEsquemaFiltros(tabla: string, esquema: string, filtro?: Filtro): Promise<any[]> {
    if (filtro) {
      console.log('filtro', JSON.stringify(filtro));
      let headers = new Headers();
      headers.append('Accept', 'application/json');
      this.setHeadersGlobal(headers);
      let queryStr = this.processFiltros(filtro);
      let url = `${this.fullPath}/${esquema}/${tabla}${queryStr}`;
      return this.http
        .get(url, { headers: headers })
        .toPromise()
        .then(datos => (datos.json() !== null ? datos.json() : new Array<any>()))
        .catch(this.handleError);
    } else {
      return this.getByTablaEsquema(tabla, esquema);
    }
  }

  getDescripcionesColumnas(query: string, esquema, tabla): Observable<string[]> {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    this.setHeadersGlobal(headers);
    let url = `${this.fullPath}/columnas/descripcion/${esquema}/${tabla}`;
    return this.http.get(url, { headers: headers })
      .map(response => {
        let desc = <{ [key: number]: string }>response.json();
        let retorno = new Array<string>();
        for (let des in desc) {
          if (desc.hasOwnProperty(des)) {
            if (desc[des].toUpperCase().indexOf(query.toUpperCase()) >= 0
              && desc[des].toUpperCase().indexOf('ENTIDAD') < 0
              && desc[des].toUpperCase().indexOf('USUARIO') < 0) {
              retorno.push(desc[des]);
            };
          }
        }
        return retorno;
      });
  }


  private processFiltros(filtro: Filtro): string {
    let retorno: string;
    if (filtro) {
      if (filtro.paginador) {
        retorno = '?';
        let pagStr: string;
        if (filtro.paginador.inicio && filtro.paginador.regPorPagina) {
          pagStr = `inicio=${filtro.paginador.inicio}&regPorPagina=${filtro.paginador.regPorPagina}`;
          retorno = `${retorno}${pagStr}`;
        }
      }
      if (filtro.orden) {
        if (filtro.orden.orden) {
          retorno = `${retorno}&orden=${filtro.orden.orden}`;
        }
        if (filtro.orden.columnaOrden) {
          retorno = `${retorno}&columnaOrden=${filtro.orden.columnaOrden}`;
        }
      }
    }
    return retorno;
  }

  private handleError(error: any) {
    console.error('Error en llamada a servicio', JSON.stringify(error));
    return Promise.reject(JSON.stringify(error));
  }

  private setHeadersGlobal(headers: Headers) {
    this._authsrv.authHeaders(headers);
  }

}
