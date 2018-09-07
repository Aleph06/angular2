import { style } from '@angular/animations';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'i-sync-dialogo-carga',
  template: `
    <mat-dialog-content style="overflow: visible">
        <mat-spinner></mat-spinner>
    </mat-dialog-content>
  `
})
export class DialogoCargaComponent {

  constructor(public dialogRef: MatDialogRef<DialogoCargaComponent>) { }

}


