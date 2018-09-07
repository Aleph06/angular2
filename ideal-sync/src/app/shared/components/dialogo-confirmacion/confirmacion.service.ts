import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { MensajeConfirmacion } from '../../models';
import { DialogoConfirmacionComponent } from './dialogo-confirmacion.component';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ConfirmacionService {

  /**
   * Propiedades de configuración para diálogo de confirmación
   *
   * @private
   * @type {MatDialogConfig}
   * @memberof ConfirmacionService
   */
  private _config: MatDialogConfig = {
    disableClose: false
  };

  /**
   * Creates an instance of ConfirmacionService.
   * @param {MatDialog} dialog Servicio para manejo de dialogos MaterialModule
   *
   * @memberof ConfirmacionService
   */
  constructor(public dialog: MatDialog) { }

  /**
   * Abre un cuadro de diálogo utilizando los datos proporcionados en el mensaje.
   *
   * @param {MensajeConfirmacion} mensaje objeto con los datos a mostrar en el cuadro de diálogo
   * @returns {Observable<boolean>} Observable que resuelve true si el usuario confirma y false si cancela.
   *
   * @memberof ConfirmacionService
   */
  confirmar(mensaje: MensajeConfirmacion): Observable<boolean> {
    this._config.data = mensaje;
    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, this._config);
    return dialogRef.afterClosed().pipe(
      map(resultado => String(resultado) === 'OK'),
      catchError(error => {
        console.log(error);
        return of<boolean>(false);
      })
    );
  }

  /**
   * Abre un cuadro de diálogo que muestra el mensaje propocionado.
   *
   * @param {string} mensaje El mensaje a mostrar en el cuadro de diálogo.
   * @returns {Observable<boolean>} Observable que resuelve true si el usuario confirma y false si cancela.
   *
   * @memberof ConfirmacionService
   */
  confirmarSimple(mensaje: string): Observable<boolean> {
    const confirma = <MensajeConfirmacion>{ 'mensaje': mensaje };
    return this.confirmar(confirma);
  }

}
