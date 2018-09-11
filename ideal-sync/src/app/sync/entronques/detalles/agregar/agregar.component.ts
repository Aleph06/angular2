import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CargandoService, ConfirmacionService, MensajesService, SessionService } from '../../../../shared';
import { PermisosUsuarioService } from '../../../shared';
import { Entronque } from '../../shared';


@Component({
  selector: 'i-sync-entronque-agregar',
  templateUrl: './agregar.component.html',
  styles:[``]
})
export class AgregarComponent implements OnInit {

  @Input() entronque: Entronque;

  constructor(private _permisosUsuarioService: PermisosUsuarioService,
    private _sesionInfoService: SessionService,
    private _cargandoService: CargandoService,
    private _router: Router,
    private _dialogoConfirmacionService: ConfirmacionService,
    private _mensajesSrv: MensajesService) { }

  ngOnInit() {
  }

  entronqueAgregado(cambio: any) {
    if (cambio['evento'] === 'entronque') {
      this.entronque = (cambio['entronque'] as Entronque);
      // TODO corregir id
      this._permisosUsuarioService.add(this._sesionInfoService.principal.nivel, this.entronque.Id)
        .then(resp => {
          if (resp.ok) {
            this._dialogoConfirmacionService.confirmar({
              encabezado: 'Éxito', mensaje: `El entronque se a agragado correctamente.
                            ¿Desea ir a la pantalla de configuracion?`, tipo: 'info'
            })
              .subscribe(respuesta => {
                if (respuesta) {
                  this._router.navigate(['agencias', 'detalle', {
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
      // TODO permiso
      // this._sesionInfoService.agregaPermiso(this.entronque.Id);
      // TODO corregir id
      this._permisosUsuarioService.add(this._sesionInfoService.principal.nivel, this.entronque.Id)
        .then(resp => {
          if (resp.ok) {
            this._dialogoConfirmacionService.confirmar({
              encabezado: 'Éxito',
              mensaje: `El entronque se a agragado correctamente, sin embargo no se creo el enlace.
              ¿Desea ir a la pantalla de configuracion?`,
              tipo: 'warn'
            })
              .subscribe(respuesta => {
                if (respuesta) {
                  this._router.navigate(['agencias', 'detalle', {
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
