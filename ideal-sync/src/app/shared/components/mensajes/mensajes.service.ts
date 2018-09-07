import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material';
import { Mensaje } from '../../models';
import { MensajesComponent } from './mensajes.component';


export namespace TIPOS_MENSAJE {
  export const ERROR = 'error';
  export const WARN = 'warn';
  export const INFO = 'info';
  export const OK = 'ok';
}

@Injectable()
export class MensajesService {
  private _snackRef: MatSnackBarRef<MensajesComponent>;

  constructor(private _snackBar: MatSnackBar) {
  }

  agregaOK(mensaje: string, duracion = 3000) {
    this.agregaMensaje(TIPOS_MENSAJE.OK, mensaje, 0, duracion);
  }

  agregaInfo(mensaje: string, duracion = 3000) {
    this.agregaMensaje(TIPOS_MENSAJE.INFO, mensaje, 0, duracion);
  }

  agregaWarn(mensaje: string, codigo?: number, duracion = 3000) {
    this.agregaMensaje(TIPOS_MENSAJE.WARN, mensaje, (codigo || 0), duracion);
  }

  agregaError(mensaje: any, codigo?: number, duracion = 3000) {
    const errorDisplay = mensaje.Message || mensaje.message;
    console.log('errorDisplay', errorDisplay);
    const exceptionDisplay = mensaje.ExceptionMessage;
    console.log('exceptionDisplay', exceptionDisplay);
    const stackDisplay = mensaje.InnerException;
    console.log('stackDisplay', stackDisplay);
    const mensajeDisplay = (errorDisplay || exceptionDisplay)
      ? `${errorDisplay}${exceptionDisplay ? exceptionDisplay : ''}${stackDisplay ? ', ' + stackDisplay : ''}`
      : JSON.stringify(mensaje);
    console.log('agregaError', mensajeDisplay);
    this.agregaMensaje(TIPOS_MENSAJE.ERROR, mensajeDisplay, (codigo || 0), duracion);
  }

  agregaMensaje(tipo: string, mensaje: string, codigo?: number, duracion = 3000) {
    this.agrega({ 'tipo': tipo, 'mensaje': mensaje, 'codigo': (codigo || 0) }, duracion);
  }

  agrega(mensaje: Mensaje, duracion = 3000) {
    this._snackRef = this._snackBar.openFromComponent(MensajesComponent, { duration: duracion });
    this._snackRef.instance.cerrar();
    this._snackRef.instance.mensaje = mensaje;
    this._snackRef.instance.cerrar$.subscribe(cerrar => this._snackRef.dismiss());
  }
}
