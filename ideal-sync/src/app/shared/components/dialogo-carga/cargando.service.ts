import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { DialogoCargaComponent } from './dialogo-carga.component';

@Injectable()
export class CargandoService {

  /**
   * Propiedades de configuración de diálogo de carga.
   *
   * @private
   * @type {MatDialogConfig}
   * @memberof CargandoService
   */
  private _config: MatDialogConfig = {
    disableClose: true,
    panelClass: 'load-dialog-container'
  };

  /**
   * Servicio para manejar cuadros de diálogo
   *
   * @private
   * @type {MatDialogRef<DialogoCargaComponent>}
   * @memberof CargandoService
   */
  private _dialogRef: MatDialogRef<DialogoCargaComponent>;

  /**
   * Creates an instance of CargandoService.
   * @param {MatDialog} dialog Servicio para abrir diálogos de MaterialModule
   *
   * @memberof CargandoService
   */
  constructor(public dialog: MatDialog) { }

  current = false;

  /**
   *  Abre o cierra un cuadro de diálogo con un indicador de carga
   *
   * @param {boolean} cargando true si abre el diálogo, false para cerrarlo
   *
   * @memberof CargandoService
   */
  toggle(cargando: boolean) {
    if (this.current !== cargando) {
      if (cargando && (this._dialogRef === null || typeof this._dialogRef === 'undefined')) {
        setTimeout(() => {
          this._dialogRef = this.dialog.open(DialogoCargaComponent, this._config);
        }, 0);
      } else {
        setTimeout(() => {
          if (this._dialogRef !== null && !cargando && typeof this._dialogRef !== 'undefined') {
            this._dialogRef.close('cierra');
            this._dialogRef = null;
          }
        }, 0);
      }
      this.current = cargando;
    }
  }

}
