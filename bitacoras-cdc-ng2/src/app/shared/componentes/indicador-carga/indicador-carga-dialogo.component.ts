import { Component, OnInit, OnDestroy } from '@angular/core';
import { CargandoService } from './shared/index';

@Component({
  selector: 'mnx-bitacoras-cdc-indicador-carga-dialogo',
  template: `<p-dialog style="position: fixed; top: 40%; left:45%; z-index: 19861106;" 
                header="Procesando..." [(visible)]="estaCargando" modal="true" responsive="true"  [closable]="false">
                <div class="ui-g" style="text-align: center">
                    <div class="ui-g-5">
                    </div>
                    <div class="ui-g-2">
                        <i style="font-size: 200%;" class="fa fa-spinner fa-spin" ></i>
                    </div>
                    <div class="ui-g-5">
                    </div>
                </div>
            </p-dialog>`
})
export class IndicadorCargaDialogoComponent implements OnInit, OnDestroy {

  private estaCargando = false;
  private subscription: any;

  constructor(private cargandoService: CargandoService) { }

  showOrHideLoadingIndicator(loading) {
    this.estaCargando = loading;
    if (this.estaCargando) {
    } else {
    };
  }

  playLoadingAnimation() {
  }

  ngOnInit() {
    this.subscription = this.cargandoService.cargando$.subscribe(loading => this.showOrHideLoadingIndicator(loading));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
