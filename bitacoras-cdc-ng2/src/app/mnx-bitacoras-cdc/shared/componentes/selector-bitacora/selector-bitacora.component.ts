import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/components/common/api';
import { ConjuntosDeCambiosService, TablasBitacoraService } from '../../servicios';
import { TablaOrigen, ConjuntoDeCambios } from '../../modelos';
import { CargandoService, MensajesService } from '../../../../shared';

@Component({
  selector: 'mnx-bitacoras-cdc-selector-bitacora',
  templateUrl: './selector-bitacora.component.html'
})
export class SelectorBitacoraComponent implements OnInit {

  @Input()
  public idTabOrigen: number;
  // public tablaOrigen: TablaOrigen;
  // conjuntosDC: Array<ConjuntoDeCambios>;
  conjuntosDCSI: SelectItem[];
  // tablasOrigen: Array<TablaOrigen>;
  tablasOrigenSI: SelectItem[];
  formSelector: FormGroup;
  @Input()
  public idConjCambios: number;
  @Output()
  tablaSeleccionada: EventEmitter<number> = new EventEmitter<number>();

  constructor(private _cargandoService: CargandoService,
    private _mensajesSrv: MensajesService,
    private _cnjCamSrv: ConjuntosDeCambiosService,
    private _tblBitSrv: TablasBitacoraService,
    private _route: ActivatedRoute,
    private _location: Location,
    private _builder: FormBuilder) { }

  ngOnInit() {
    console.log('SelectorBitacoraComponent:ngOnInit');
    this.initForm();
    this.attachEvents();
    this.initSelectItems();
    // if (this.tablaOrigen === null || (typeof this.tablaOrigen === 'undefined')) {
    //   if (this.idTabOrigen === null || (typeof this.idTabOrigen === 'undefined')) {
    //     this._route.params.forEach((params: Params) => {
    //       this.idTabOrigen = +params['idTabOrigen'];
    //     });
    //   }
    //   console.log('SelectorBitacoraComponent:idTabOrigen', this.idTabOrigen);
    //   if (!isNaN(this.idTabOrigen)) {
    //     this._cargandoService.toggleLoadingIndicator(true);
    //     this._tblBitSrv.getByidTabOrigen(this.idTabOrigen)
    //       .then(tablaBit => {
    //         console.log('SelectorBitacoraComponent:tablaBit', tablaBit);
    //         this.tablaOrigen = tablaBit.idTabOrigen;
    //         console.log('SelectorBitacoraComponent:tablaOrigen', tablaBit.idTabOrigen);
    //         this.idConjCambios = tablaBit.idConjCam.idConjCam;
    //         console.log('SelectorBitacoraComponent:idConjCambios', tablaBit.idConjCam.idConjCam);
    //         this._cargandoService.toggleLoadingIndicator(false);
    //         this.updateFormValues();
    //       })
    //       .catch(error => this.handleError(error));
    //   } else {
    //     this.tablaOrigen = new TablaOrigen(null, 0, null);
    //     this.idConjCambios = null;
    //     this.updateFormValues();
    //   }
    // }
  }

  initForm(): void {
    this.formSelector = this._builder.group({
      conjCambios: [this.idConjCambios, Validators.required],
      tablaOrigen: [{
        value: this.idTabOrigen,
        disabled: (this.idTabOrigen === null || (typeof this.idTabOrigen === 'undefined'))
        && (this.idConjCambios === null || (typeof this.idConjCambios === 'undefined'))
      }, Validators.required]
    });
  };

  // updateFormValues(): void {
  //   this.formSelector.get('conjCambios').setValue(this.idConjCambios);
  //   this.formSelector.get('tablaOrigen').setValue(this.tablaOrigen.idTabOrigen);
  //   if (this.tablaOrigen.idTabOrigen > 0) {
  //     this.formSelector.get('tablaOrigen').enable();
  //   }
  // }

  initSelectItems(): void {
    this._cargandoService.toggleLoadingIndicator(true);
    this.initSelectItemsCC()
      .then(exito => {
        this._cargandoService.toggleLoadingIndicator(false);
        if (exito && (this.idConjCambios !== null)) {
          this.construyeSelectItemsTO();
        }
      });
  }

  private initSelectItemsCC(): Promise<boolean> {
    return Promise.resolve(this._cnjCamSrv.getAll()
      .then(conjuntos => {
        // this.conjuntosDC = conjuntos;
        this.conjuntosDCSI = conjuntos.map<SelectItem>(c => { return { label: c.nomConjCam, value: c.idConjCam }; });
        let labelCC = this.conjuntosDCSI.length > 0 ? 'Seleccione' : 'Sin resultados';
        this.conjuntosDCSI.splice(0, 0, { label: labelCC, value: null });
        return (this.idTabOrigen !== null && (typeof this.idTabOrigen !== 'undefined'));
      })
      .catch(error => { this.handleError(error); return false; }));
  }

  private construyeSelectItemsTO(): void {
    if (this.idConjCambios !== null && (!isNaN(this.idConjCambios))) {
      this._cargandoService.toggleLoadingIndicator(true);
      this._tblBitSrv.getByConjCambios(this.idConjCambios)
        .then(tablas => {
          // this.tablasOrigen = tablas.map<TablaOrigen>(tb => tb.idTabOrigen);
          this.tablasOrigenSI = tablas.map<TablaOrigen>(tb => tb.idTabOrigen)
            .map<SelectItem>(to => { return { label: to.nomTabOrigen, value: to.idTabOrigen }; });
          let labelTO = this.tablasOrigenSI.length > 0 ? 'Seleccione' : 'Sin resultados';
          this.tablasOrigenSI.splice(0, 0, { label: labelTO, value: null });
          this.formSelector.get('tablaOrigen').reset();
          this.formSelector.get('tablaOrigen').enable();
          this.tablaSeleccionada.emit(0);
          this._cargandoService.toggleLoadingIndicator(false);
        })
        .catch(error => {
          // this.tablasOrigen = new Array<TablaOrigen>();
          this.formSelector.get('tablaOrigen').reset();
          this.handleError(error);
        });
    }
  }

  private attachEvents(): void {
    this.formSelector.get('conjCambios').valueChanges.subscribe(conjSelect => {
      console.log('conjSelect', +conjSelect);
      this.idConjCambios = +conjSelect;
      this.construyeSelectItemsTO();
    });
    this.formSelector.get('tablaOrigen').valueChanges.subscribe(tblSelect => {
      console.log('tblSelect', +tblSelect);
      let Idt = +tblSelect;
      // if (this.tablasOrigen && this.tablasOrigen.length > 0) {
      if (!isNaN(Idt)) {
        // let t = this.tablasOrigen.find(to => to.idTabOrigen === Idt);
        // this.tablaOrigen = t;
        this.tablaSeleccionada.emit(Idt);
      } else {
        this.tablaSeleccionada.emit(null);
      }
      // }
    });
  }

  /**
   * Maneja errores
   * 
   * @private
   * @param {*} error el error a manejenar
   * 
   * @memberOf MnxBitacorasCDCComponent
   */
  private handleError(error: any) {
    console.log(error);
    this._mensajesSrv.agregaError(error);
    this._cargandoService.toggleLoadingIndicator(false);
  }

}
