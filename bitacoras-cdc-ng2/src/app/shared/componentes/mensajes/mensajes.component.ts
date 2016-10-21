import { Component, OnInit, OnDestroy } from '@angular/core';
import { MensajesService } from './shared/index';
import { Message } from 'primeng/primeng';

@Component({
  selector: 'mnx-bitacoras-cdc-mensajes',
  template: `<p-messages [value]="mensajes"></p-messages>`
})
export class MensajesComponent implements OnInit, OnDestroy {

  mensajes: Array<Message>;
  private sub: any;

  constructor(private _mensajesService: MensajesService) { }

  ngOnInit() {
    this.mensajes = new Array<Message>();
    this.sub = this._mensajesService.mensaje$.subscribe(mnsj => this.agregaMensaje(mnsj));
  }

  agregaMensaje(mensaje: any) {
    this.mensajes.length = 0;
    this.mensajes.push(mensaje);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
