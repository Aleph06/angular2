import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CargandoService, DialogoConfirmacionService, MensajesService, SesionInfoService } from '../../../../shared';
import { Entronque, Base } from '../../shared';
import { PermisosUsuarioService } from '../../../shared';

@Component({
  selector: 'ideal-sync-entronque-editar',
  templateUrl: './editar.component.html'
})
export class EditarComponent implements OnInit {

  @Input() entronque: Entronque;
  updateEntronque = new EventEmitter<any>();

  constructor(private _dialogoConfirmacionService: DialogoConfirmacionService,
    private _mensajesSrv: MensajesService) { }

  ngOnInit() {
  }

  entronqueActualizado(cambio: any) {
    if (cambio['evento'] === 'entronque') {
      this.entronque = (cambio['entronque'] as Entronque);
      this._mensajesSrv.agregaInfo('Exito', `Entronque ${this.entronque.Descripcion} actualizador correctamente`);
      this.updateEntronque.emit({ event: 'enlace', value: true });
    } else if (cambio['evento'] === 'sinEnlace') {
      this.entronque = (cambio['entronque'] as Entronque);
      this._mensajesSrv.agregaInfo('Exito', `Los datos se actualizador correctamente, sin embargo el enlace no se creo correctamente`);
      this.updateEntronque.emit({ event: 'enlace', value: false });
    } else if (cambio['evento'] === 'error') {
      this._mensajesSrv.agregaMensaje('error', 'Error', cambio['error']);
      console.log(cambio['error']);
    }
  }

  sqlValid(baseOrigen: Base): void {
    this.entronque.baseOrigen = baseOrigen;
    if (baseOrigen.Estatus) {
      this._mensajesSrv.agregaInfo('Exito', `Consulta correcta.`);
      this.updateEntronque.emit({ event: 'base', value: true });
    } else {
      this._mensajesSrv.agregaError(`Consulta invalida.`);
      this.updateEntronque.emit({ event: 'base', value: false });
    }
  }
}
