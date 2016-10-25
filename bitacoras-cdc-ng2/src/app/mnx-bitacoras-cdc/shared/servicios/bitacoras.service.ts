import { Injectable, Inject } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import { AuthService, Base64 } from '../../../shared';
import { Filtro, TablaOrigen } from '../modelos';

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
        .then(datos => {
          let resumenBitacora = (datos.json() !== null ? datos.json() : new Array<any>());
          if (resumenBitacora['registros'] && resumenBitacora['registros'] !== null
            && (typeof resumenBitacora['registros'] !== 'undefined')) {
            let retornoO = <any>resumenBitacora['registros'];
            let retornoA = new Array<any>();
            if (retornoO['campo'] && retornoO['campo'] !== null && (typeof retornoO['campo'] !== 'undefined')) {
              retornoA.push(retornoO);
              console.log('resp', JSON.stringify(retornoA));
              resumenBitacora['registros'] = retornoA;
            } else {
              let retonoOA = <any[]>resumenBitacora['registros'];
              console.log('resp', JSON.stringify(retonoOA));
              if (retonoOA.length > 0) {
                resumenBitacora['registros'] = retonoOA;
              }
            }
          }
          return resumenBitacora;
        })
        .catch(this.handleError);
    } else {
      return this.getByTablaEsquema(tabla, esquema);
    }
  }

  getDescripcionesColumnas(query: string, esquema, tabla): Observable<string[]> {
    console.log('busqueda', query);
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

  getDetallesBitacora(tabOrigen: TablaOrigen, idBitacora: number): Promise<any[]> {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    this.setHeadersGlobal(headers);
    let url = `${this.fullPath}/detalles/${tabOrigen.esquemaTabOrigen}/${tabOrigen.nomTabOrigen}/${idBitacora}`;
    return this.http
      .get(url, { headers: headers })
      .toPromise()
      .then(datos => {
        let retornoO = datos.json() !== null ? <any>datos.json().detalleBitacora : {};
        console.log('resp', JSON.stringify(retornoO));
        let retornoA = new Array<any>();
        if (retornoO['campo'] && retornoO['campo'] !== null && (typeof retornoO['campo'] !== 'undefined')) {
          retornoA.push(retornoO);
          console.log('resp', JSON.stringify(retornoA));
          return retornoA;
        } else {
          let retonoOA = datos.json() !== null ? <any[]>datos.json().detalleBitacora : new Array<any>();
          console.log('resp', JSON.stringify(retonoOA));
          if (retonoOA.length > 0) {
            return retonoOA;
          } else {
            return new Array<any>();
          }
        }
      })
      .catch(this.handleError);
  }

  private processFiltros(filtro: Filtro): string {
    let retorno: string;
    if (filtro) {
      if (filtro.paginador) {
        retorno = '?';
        let pagStr: string;
        console.log('inicio', filtro.paginador.inicio);
        console.log('regPorPagina', filtro.paginador.regPorPagina);
        console.log('es:', (filtro.paginador.inicio && filtro.paginador.regPorPagina));
        if ((typeof filtro.paginador.inicio !== 'undefined') && (typeof filtro.paginador.regPorPagina !== 'undefined')) {
          pagStr = `inicio=${filtro.paginador.inicio}&regPorPagina=${filtro.paginador.regPorPagina}`;
          retorno = `${retorno}${pagStr}`;
        }
        console.log('retorno', retorno);
      }
      if (filtro.orden) {
        if (filtro.orden.orden) {
          retorno = `${retorno}&orden=${filtro.orden.orden}`;
        }
        if (filtro.orden.columnaOrden) {
          retorno = `${retorno}&columnaOrden=${filtro.orden.columnaOrden}`;
        }
      }
      if (filtro.operacion) {
        retorno = `${retorno}&op=${filtro.operacion}`;
      }
      if (filtro.usuario) {
        retorno = `${retorno}&us=${filtro.usuario}`;
      }
      if (filtro.fechaInicial) {
        let dia = `${filtro.fechaInicial.getDate() < 10 ? '0' : ''}${String(filtro.fechaInicial.getDate())}`;
        let mes = `${(filtro.fechaInicial.getMonth() + 1) < 10 ? '0' : ''}${String(filtro.fechaInicial.getMonth() + 1)}`;
        retorno = `${retorno}&finicial=${dia}${mes}${filtro.fechaInicial.getFullYear()}`;
      }
      if (filtro.fechaFinal) {
        let dia = `${filtro.fechaInicial.getDate() < 10 ? '0' : ''}${String(filtro.fechaInicial.getDate())}`;
        let mes = `${(filtro.fechaInicial.getMonth() + 1) < 10 ? '0' : ''}${String(filtro.fechaInicial.getMonth() + 1)}`;
        retorno = `${retorno}&ffinal=${dia}${mes}${filtro.fechaFinal.getFullYear()}`;
      }
      if (filtro.llaves) {
        let str = '';
        for (let key in filtro.llaves) {
          if (filtro.llaves.hasOwnProperty(key)) {
            str = `${key}=${filtro.llaves[key]},`;
          }
        }
        if (str.length > 0) {
          let base64 = new Base64();
          retorno = `${retorno}&llave=${base64.encode(str)}`;
        }
      }
      if (filtro.columnasConCambio && filtro.columnasConCambio.length > 0) {
        let str = '';
        filtro.columnasConCambio
          .forEach(cc => {
            str = `${str}${cc},`;
          });
        if (str.length > 0) {
          let base64 = new Base64();
          retorno = `${retorno}&colcc=${base64.encode(str)}`;
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
