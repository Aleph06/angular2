import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CargandoService, DialogoConfirmacionService, MensajesService, SesionInfoService } from '../../../../shared';
import { PermisosUsuarioService } from '../../../shared';
import { Entronque } from '../../shared';


@Component({
  selector: 'ideal-sync-entronque-agregar',
  templateUrl: './agregar.component.html'
})
export class AgregarComponent implements OnInit {

  @Input() entronque: Entronque;

  constructor(private _permisosUsuarioService: PermisosUsuarioService,
    private _sesionInfoService: SesionInfoService,
    private _cargandoService: CargandoService,
    private _router: Router,
    private _dialogoConfirmacionService: DialogoConfirmacionService,
    private _mensajesSrv: MensajesService) { }

  ngOnInit() {
  }

  entronqueAgregado(cambio: any) {
    if (cambio['evento'] === 'entronque') {
      this.entronque = (cambio['entronque'] as Entronque);
      this._permisosUsuarioService.add(this._sesionInfoService.idUsuario, this.entronque.Id)
        .then(resp => {
          if (resp.ok) {
            this._dialogoConfirmacionService.confirmarBasic('Éxito', `El entronque se a agragado correctamente. 
                            ¿Desea ir a la pantalla de configuracion?`)
              .then(respuesta => {
                if (respuesta) {
                  this._router.navigate(['/entronques/detalle', {
                    idAutopista: this.entronque.IdGrupo,
                    id: this.entronque.Id
                  }]);
                } else {
                  this._router.navigate(['/']);
                }
              });
          }
        });
    } else if (cambio['evento'] === 'sinEnlace') {
      this.entronque = (cambio['entronque'] as Entronque);
      this._sesionInfoService.agregaPermiso(this.entronque.Id);
      this._permisosUsuarioService.add(this._sesionInfoService.idUsuario, this.entronque.Id)
        .then(resp => {
          if (resp.ok) {
            this._dialogoConfirmacionService.confirmarBasic('Éxito',
              `El entronque se a agragado correctamente, sin embargo no se creo el enlace. ¿Desea ir a la pantalla de configuracion?`)
              .then(respuesta => {
                if (respuesta) {
                  this._router.navigate(['/entronques/detalle', {
                    idAutopista: this.entronque.IdGrupo,
                    id: this.entronque.Id
                  }]);
                } else {
                  this._router.navigate(['/']);
                }
              });
          }
        });
    } else if (cambio['evento'] === 'error') {
      this._mensajesSrv.agregaMensaje('error', 'Error', cambio['error']);
      console.log(cambio['error']);
    }
  }

}
