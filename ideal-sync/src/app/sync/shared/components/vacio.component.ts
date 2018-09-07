import { Component, OnInit } from '@angular/core';
import { SessionService } from 'app/shared';

@Component({
  selector: 'i-sync-vacio',
  template: `
    <br/><br/>
    <div fxLayout="row" fxLayoutAlign="start stretch" style="width:100%;">
      <mat-icon class="md-48">home</mat-icon>
      <h3 style="margin-top: -0px;">Bienvenido {{ nombreUsuario }}</h3>
    </div>
  `,
  styles: []
})
export class VacioComponent implements OnInit {

  nombreUsuario: string;

  constructor(private _ssnSrv: SessionService) { }

  ngOnInit() {
    this.nombreUsuario = this._ssnSrv.principal.Usuario;
  }

}
