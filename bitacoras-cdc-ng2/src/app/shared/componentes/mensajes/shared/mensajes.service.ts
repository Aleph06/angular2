import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/share';

@Injectable()
export class MensajesService {

  mensaje$: Observable<any>;
  private _observer: Observer<any>;

  constructor() {
    this.mensaje$ = new Observable(
      observer => this._observer = observer).share();
  }

  agregaMensaje(severidad: string, resumen: string, detalle) {
    console.log('MensajesService:agregaMensaje', JSON.stringify({ severity: severidad, summary: resumen, detail: detalle }));
    if (this._observer) {
      this._observer.next({ severity: severidad, summary: resumen, detail: detalle });
    }
  }

  agrega(mensaje: any) {
    console.log('MensajesService:agrega', JSON.stringify(mensaje));
    if (this._observer) {
      if (mensaje['severidad'] && mensaje['resumen'] && mensaje['detalle']) {
        this._observer.next({ severity: mensaje['severidad'], summary: mensaje['resumen'], detail: mensaje['detalle'] });
      }
    }
  }

  agregaError(error: any) {
    this.agregaMensaje('error', 'Error', (error.Message || error));
  }

  agregaWarn(encabezado: string, mensaje: string) {
    this.agregaMensaje('warn', encabezado, mensaje);
  }

  agregaInfo(encabezado: string, mensaje: string) {
    this.agregaMensaje('info', encabezado, mensaje);
  }

}
