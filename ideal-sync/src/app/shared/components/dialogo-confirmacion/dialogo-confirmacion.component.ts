import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MensajeConfirmacion } from '../../models';

@Component({
  selector: 'i-sync-dialogo-confirmacion',
  template: `
    <h2 style="text-align: center" *ngIf="mensaje.encabezado" mat-dialog-title>
      {{mensaje?.encabezado}}
      <i *ngIf="mensaje.tipo" [class]="'fa fa-'+ icon"></i>
    </h2>

    <mat-dialog-content *ngIf="mensaje.mensaje" >
      <h3 style="text-align: center">
        {{mensaje?.mensaje}}
      </h3>
    </mat-dialog-content>
    <mat-dialog-actions fxLayout="row" fxLayoutAlign="space-around center">
      <button mat-button (click)="dialogRef.close('OK')">Aceptar</button>
      <button mat-button (click)="dialogRef.close('CA')">Cancelar</button>
    </mat-dialog-actions>
  `
})
export class DialogoConfirmacionComponent {

  mensaje: MensajeConfirmacion;

  constructor(public dialogRef: MatDialogRef<DialogoConfirmacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.mensaje = <MensajeConfirmacion>data;
  }

  get icon(): string {
    return this.mensaje ?
      (this.mensaje.tipo ?
        (this.mensaje.tipo === 'info' ?
          'question' :
          (this.mensaje.tipo === 'warn' ?
            'warning' :
            (this.mensaje.tipo === 'error' ?
              'times-circle-o' :
              'check-circle-o')
          )
        ) :
        'question') :
      'question';
  }

}
