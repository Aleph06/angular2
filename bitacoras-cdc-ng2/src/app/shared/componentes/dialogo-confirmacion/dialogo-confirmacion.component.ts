import { Component, OnInit, OnDestroy } from '@angular/core';
import { DialogoConfirmacionService, MensajeConfirmacion } from './shared/index';

@Component({
  selector: 'mnx-bitacoras-cdc-dialogo-confirmacion',
  templateUrl: 'dialogo-confirmacion.component.html'
})
export class DialogoConfirmacionComponent implements OnInit, OnDestroy {

  mensaje: MensajeConfirmacion;
  private confirmando = false;
  private subscription: any;

  constructor(private dialogoConfirmacionService: DialogoConfirmacionService) { }

  ngOnInit() {
    this.mensaje = new MensajeConfirmacion('', '');
    this.subscription = this.dialogoConfirmacionService.confirmando$.subscribe(confirmando => this.mostrarConfirmacion(confirmando));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  mostrarConfirmacion(val: boolean) {
    this.confirmando = val;
    if (val) {
      this.mensaje = this.dialogoConfirmacionService.mensaje;
    }
  }

  confirma() {
    this.dialogoConfirmacionService.confirmacion();
  }
  cancela() {
    this.dialogoConfirmacionService.cancelacion();
  }

}
