import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CargandoService, ConfirmacionService, MensajesService, SessionService } from '../../../../shared';
import { Entronque, Base } from '../../shared';
import { PermisosUsuarioService } from '../../../shared';

@Component({
  selector: 'i-sync-entronque-editar',
  templateUrl: './editar.component.html'
})
export class EditarComponent implements OnInit {

  @Input() entronque: Entronque;
  updateEntronque = new EventEmitter<any>();

  constructor(private _dialogoConfirmacionService: ConfirmacionService,
    private _mensajesSrv: MensajesService) { }

  ngOnInit() {
  }

  entronqueActualizado(cambio: any) {
    if (cambio['evento'] === 'entronque') {
      this.entronque = (cambio['entronque'] as Entronque);
      this._mensajesSrv.agregaInfo(`Entronque ${this.entronque.Descripcion} actualizador correctamente`);
      this.updateEntronque.emit({ event: 'enlace', value: true });
    } else if (cambio['evento'] === 'sinEnlace') {
      this.entronque = (cambio['entronque'] as Entronque);
      this._mensajesSrv.agregaInfo(`Los datos se actualizador correctamente, sin embargo el enlace no se creo correctamente`);
      this.updateEntronque.emit({ event: 'enlace', value: false });
    } else if (cambio['evento'] === 'error') {
      this._mensajesSrv.agregaMensaje('error', 'Error', cambio['error']);
      console.log(cambio['error']);
    }
  }

  sqlValid(baseOrigen: Base): void {
    this.entronque.baseOrigen = baseOrigen;
    if (baseOrigen.Estatus) {
      this._mensajesSrv.agregaInfo(`Consulta correcta.`);
      this.updateEntronque.emit({ event: 'base', value: true });
    } else {
      this._mensajesSrv.agregaError(`Consulta invalida.`);
      this.updateEntronque.emit({ event: 'base', value: false });
    }
  }
}
