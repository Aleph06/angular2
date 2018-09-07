import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SessionService, LoginService, Identity } from 'app/shared';

@Component({
  selector: 'i-sync-autorizar-modal',
  templateUrl: './autorizar-modal.component.html',
  styles: []
})
export class AutorizarModalComponent {

  mensaje: string;
  autorizaForm: FormGroup;
  error: string;
  inProcess = false;
  nivel: number;
  app: string;

  constructor(public dialogRef: MatDialogRef<AutorizarModalComponent>,
    private _builder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
    private _accessSrv: LoginService, private _ssnSrv: SessionService) {
    this.mensaje = <string>data.mensaje;
    this.nivel = <number>data.nivel;
    this.app = <string>data.app;
    this.autorizaForm = this._builder.group({
      usuario: ['', Validators.required],
      accesskey: ['', Validators.required]
    });
  }

  isAutorized() {
    const data = <Identity>this.autorizaForm.value;
    this.inProcess = true;
    Object.keys(this.autorizaForm.controls).forEach(key => {
      this.autorizaForm.get(key).disable();
    });
    this._accessSrv.autorizar(data, this.nivel, this.app)
    .toPromise()
      .then(isAutorized => {
        if (isAutorized) {
          this.dialogRef.close('OK');
        } else {
          this.error = 'No cuena con los permisos necesarios.';
          Object.keys(this.autorizaForm.controls).forEach(key => {
            this.autorizaForm.get(key).enable();
            this.inProcess = false;
          });
        }
      })
      .catch(error => {
        this.error = 'No fue posible efectuar la autorización.';
        Object.keys(this.autorizaForm.controls).forEach(key => {
          this.autorizaForm.get(key).enable();
          this.inProcess = false;
        });
      });
  }

}
