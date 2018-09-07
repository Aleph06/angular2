import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { MensajesService, LoginService } from 'app/shared';

@Component({
  selector: 'i-sync-recupera-pwd',
  templateUrl: './recupera-pwd.component.html',
  styles: []
})
export class RecuperaPwdComponent implements OnInit {

  usuarioCtrl: FormControl;

  constructor(private builder: FormBuilder, private loginSrv: LoginService,
    private msjSrv: MensajesService) {
    this.usuarioCtrl = builder.control(null, Validators.required);
  }

  ngOnInit() {
  }

  onSubmit(): void {
    if (this.usuarioCtrl.valid) {
      this.loginSrv.resetPwd(String(this.usuarioCtrl.value))
        .subscribe(mensaje => {
          this.msjSrv.agregaInfo(mensaje);
        },
          error => {
            console.log(error);
            this.msjSrv.agregaError(error);
          });
    }
  }

}
