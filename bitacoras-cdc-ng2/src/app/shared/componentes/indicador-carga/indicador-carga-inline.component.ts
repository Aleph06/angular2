import { Component, OnInit, OnDestroy } from '@angular/core';
import { CargandoService } from './shared/index';

@Component({
  selector: 'mnx-bitacoras-cdc-indicador-carga-inline',
  template: `<i *ngIf="estaCargando" style="font-size: xx-large; position: relative; right: 30px;"
                class="fa fa-circle-o-notch fa-spin"></i>`
})
export class IndicadorCargaInlineComponent implements OnInit, OnDestroy {

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