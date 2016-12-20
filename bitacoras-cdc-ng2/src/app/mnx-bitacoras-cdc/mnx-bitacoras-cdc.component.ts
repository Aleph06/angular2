import { Title } from '@angular/platform-browser';
import { Component, ViewChild } from '@angular/core';

import { ConsultaBitacoraComponent } from './shared/componentes';


/**
 * Componente principal de consulta de bitácoras
 * 
 * @export Componente con selector de bitacora
 * @class MnxBitacorasCDCComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'mnx-bitacoras-cdc',
  templateUrl: 'mnx-bitacoras-cdc.component.html',
  styleUrls: ['mnx-bitacoras-cdc.component.css']
})
export class MnxBitacorasCDCComponent {

  public idTabOrigen: number;
  @ViewChild(ConsultaBitacoraComponent)
  private consultaBitacoraComponent: ConsultaBitacoraComponent;

  constructor(private _titleSrv: Title) {
    this._titleSrv.setTitle('Bitácoras CDC - Consulta General');
  }

  setIdTabOrigen(idTabOrigen: number) {
    if (idTabOrigen > 0) {
      this.idTabOrigen = idTabOrigen;
      this.consultaBitacoraComponent.selectTabOrigen(idTabOrigen, true);
    }
  }

}
