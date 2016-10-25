import { Title } from '@angular/platform-browser';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { CookieService } from 'angular2-cookie/core';
import { CargandoService, MensajesService, Rango, RangoFechasComponent } from '../shared';
import { ConjuntosDeCambiosService, BitacorasService, TablasBitacoraService } from './shared/servicios';
import { TablaOrigen, ConjuntoDeCambios, Filtro, Paginador, Orden } from './shared/modelos';
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

  setIdTabOrigen(idTabOrigen: number) {
    if (idTabOrigen > 0) {
      this.idTabOrigen = idTabOrigen;
      this.consultaBitacoraComponent.selectTabOrigen(idTabOrigen, true);
    }
  }

}
