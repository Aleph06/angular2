import { Injectable } from '@angular/core';
import { MensajeConfirmacion } from '../index';
// import {Promise } from 'es6-shim';
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import 'rxjs/add/operator/share';

@Injectable()
export class DialogoConfirmacionService {

  mensaje: MensajeConfirmacion;
  public confirmacion: () => void;
  public cancelacion: () => void;
  confirmando$: Observable<boolean>;
  private _observer: Observer<boolean>;

  constructor() {
    this.confirmando$ = new Observable<boolean>(observer => this._observer = observer).share();
  }

  confirmarMensaje(mensaje: MensajeConfirmacion): Promise<boolean> {
    this.mensaje = mensaje;

    return new Promise<boolean>((resolve, reject) => {
      this.confirmacion = () => { this.toggleConfirmando(false); resolve(true); };
      this.cancelacion = () => { this.toggleConfirmando(false); resolve(false); };
      this.toggleConfirmando(true);
    });
  };

  confirmarBasic(encabezado: string, mensajeConfirma: string): Promise<boolean> {
    return this.confirmarMensaje(new MensajeConfirmacion(encabezado, mensajeConfirma));
  };

  toggleConfirmando(val: boolean): void {
    if (this._observer) {
      this._observer.next(val);
    }
  }

}
