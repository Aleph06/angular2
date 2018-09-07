import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { AutorizarModalComponent } from '../components/autorizar/autorizar-modal.component';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AutorizarService {

  /**
   * Propiedades de configuración para diálogo de confirmación
   *
   * @private
   * @type {MatDialogConfig}
   * @memberof ConfirmacionService
   */
  private _config: MatDialogConfig = {
    disableClose: true
  };

  /**
   * Creates an instance of ConfirmacionService.
   * @param {MatDialog} dialog Servicio para manejo de dialogos MaterialModule
   *
   * @memberof ConfirmacionService
   */
  constructor(public dialog: MatDialog) { }

  /**
   * Abre un cuadro de diálogo que muestra el mensaje propocionado.
   *
   * @param {string} mensaje El mensaje a mostrar en el cuadro de diálogo.
   * @returns {Observable<boolean>} Observable que resuelve true si el usuario confirma y false si cancela.
   *
   * @memberof ConfirmacionService
   */
  autorizar(mensaje: string, nivel?: number, app?: string): Observable<boolean> {
    this._config.data = { mensaje: mensaje, nivel: +nivel, app: app };
    const dialogRef = this.dialog.open(AutorizarModalComponent, this._config);
    return dialogRef.afterClosed()
      .pipe(
        map(resultado => String(resultado) === 'OK'),
        catchError(error => {
          console.log(error);
          return of<boolean>(false);
        })
      );
  }

}
