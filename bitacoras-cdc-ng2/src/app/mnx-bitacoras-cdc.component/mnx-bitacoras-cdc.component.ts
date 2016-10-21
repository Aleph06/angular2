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
export class MnxBitacorasCDCComponent implements OnInit {

  private searchTermStream = new Subject<string>();
  // metadata: any;
  // llave: Array<{ [key: string]: string }>;
  formConsultaGeneral: FormGroup;
  formFiltros: FormGroup;
  conjuntosDC: Array<ConjuntoDeCambios>;
  conjuntosDCSI: SelectItem[];
  tablasOrigen: Array<TablaOrigen>;
  tablasOrigenSI: SelectItem[];
  tablaOrigen: TablaOrigen;
  registrosBitacora: any[];
  columnas: any[];
  totalRegistros: number;
  operacionesSI: SelectItem[];
  buscando = false;
  rangoFechas: Rango;
  filtro: Filtro;
  items: Observable<string[]> = this.searchTermStream
    .debounceTime(500)
    .distinctUntilChanged()
    .switchMap((term: string) => {
      this.buscando = true;
      return this._bitacorasSrv
        .getDescripcionesColumnas(term, this.tablaOrigen.esquemaTabOrigen, this.tablaOrigen.nomTabOrigen)
        .finally(() => { this.buscando = false; });
    });

  constructor(private _cookieSrv: CookieService,
    private _titleSrv: Title,
    private _cargandoService: CargandoService,
    private _mensajesSrv: MensajesService,
    private _builder: FormBuilder,
    private _cnjCamSrv: ConjuntosDeCambiosService,
    private _tblBitSrv: TablasBitacoraService,
    private _bitacorasSrv: BitacorasService,
    @Inject('apiUrl') public apiUrl: string,
    @Inject('authHeader') public authHeader: string) {
  }

  ngOnInit() {
    this._titleSrv.setTitle('Bitácoras CDC - Monex');
    this.buildForm();
    this.attachEvents();
    this._cargandoService.toggleLoadingIndicator(true);
    this._cnjCamSrv.getAll()
      .then(conjuntos => {
        this.conjuntosDC = conjuntos;
        this.buildSIConjCam();
        this.buildSITabOrigen();
        this._cargandoService.toggleLoadingIndicator(false);
      })
      .catch(error => this.handleError(error));
    // this.metadata = { conjuntoCambios: 'CONTABILIDAD', tabla: 'CB_CONF_OPERACION' };

    // this.llave = [{ ['CVE_ENTIDAD']: 'MONEX' }, { ['CVE_OPERACION']: 'RETESOFE' }];
  }

  search(term: any) {
    this.searchTermStream.next(term.query);
  }

  private buildForm() {
    this.formConsultaGeneral = this._builder.group({
      conjCambios: [null, Validators.required],
      tablaOrigen: [{ value: null, disabled: true }, Validators.required]
    });
  }

  private attachEvents() {
    this.formConsultaGeneral.get('conjCambios').valueChanges.subscribe(conjSelect => {
      if (conjSelect !== null) {
        this._cargandoService.toggleLoadingIndicator(true);
        this._tblBitSrv.getByConjCambios(+conjSelect)
          .then(tablas => {
            this.tablasOrigen = tablas.map<TablaOrigen>(tb => tb.idTabOrigen);
            this.buildSITabOrigen();
            this._cargandoService.toggleLoadingIndicator(false);
          })
          .catch(error => {
            this.tablasOrigen = new Array<TablaOrigen>();
            this.buildSITabOrigen();
            this.formConsultaGeneral.get('tablaOrigen').reset();
            this.handleError(error);
          });
      } else {
        this.tablasOrigen = new Array<TablaOrigen>();
        this.buildSITabOrigen();
        this.formConsultaGeneral.get('tablaOrigen').reset();
      }
      if (this.formConsultaGeneral.get('conjCambios').invalid) {
        this.formConsultaGeneral.get('tablaOrigen').disable();
      } else {
        this.formConsultaGeneral.get('tablaOrigen').enable();
      }
    });
  }

  private buildSIConjCam(): void {
    if (this.conjuntosDC) {
      this.conjuntosDCSI = this.conjuntosDC.map<SelectItem>(c => { return { label: c.nomConjCam, value: c.idConjCam }; });
      let labelCC = this.conjuntosDCSI.length > 0 ? 'Seleccione' : 'Sin resultados';
      this.conjuntosDCSI.splice(0, 0, { label: labelCC, value: null });
    }
  }

  private buildSITabOrigen(): void {
    if (this.tablasOrigen) {
      this.tablasOrigenSI = this.tablasOrigen.map<SelectItem>(to => { return { label: to.nomTabOrigen, value: to.idTabOrigen }; });
      let labelTO = this.tablasOrigenSI.length > 0 ? 'Seleccione' : 'Sin resultados';
      this.tablasOrigenSI.splice(0, 0, { label: labelTO, value: null });
    }
  }

  consultaBitacora(filtro?: Filtro): void {
    if (this.formConsultaGeneral.valid) {
      let idT = +this.formConsultaGeneral.get('tablaOrigen').value;
      this.tablaOrigen = this.tablasOrigen.find(to => (+to.idTabOrigen === idT));
      this._cargandoService.toggleLoadingIndicator(true);
      this._bitacorasSrv.getByTablaEsquemaFiltros(this.tablaOrigen.nomTabOrigen, this.tablaOrigen.esquemaTabOrigen, filtro)
        .then(bitacora => {
          console.log(`Bitacora: {${this.tablaOrigen.esquemaTabOrigen} - ${this.tablaOrigen.nomTabOrigen}}`);
          this.registrosBitacora = new Array<{ [key: string]: string }>();
          let reg: { [key: string]: string } = {};
          (bitacora['registros'] as any[]).forEach(r => {
            (r['campo'] as any[]).forEach(rc => {
              reg[rc['columna']] = rc['valor'];
            });
            this.registrosBitacora.push(Object.assign({}, reg));
          });
          console.log(`registros`, JSON.stringify(this.registrosBitacora));
          this.columnas = (bitacora['columnas'] as any[])
            .filter(c => (c['nombre'] !== 'CVE_ENTIDAD' && c['llavePrimaria'] === 'true'))
            .map<any>(c => { return { field: c['nombre'], header: c['descripcion'] }; });
          console.log(`columnas`, JSON.stringify(this.columnas));
          this.totalRegistros = +bitacora['@totalRegistros'];
          console.log(`totalRegistros`, JSON.stringify(this.totalRegistros));
          this.construyeFiltros();
          this._cargandoService.toggleLoadingIndicator(false);
        })
        .catch(error => this.handleError(error));
    }
  }

  construyeFiltros() {
    this.formFiltros = this._builder.group({
      operacion: [null],
      columnas: this.initColumnasControl(),
      descUsuario: [null],
      rangoFechas: this.initRangoFechas(),
      llaves: this.initArrayLlaves()
    });
    this.filtro = new Filtro();
    this.formFiltros.valueChanges.subscribe(val => {
      console.log('formFiltros.value', JSON.stringify(val));
      if (val['operacion'] !== null) {
        this.filtro.operacion = val['operacion'];
      }
      if (val['descUsuario'] !== null) {
        this.filtro.usuario = val['descUsuario'];
      }
      if (val['columnas'] !== null && (<string[]>val['columnas']).length > 0) {
        this.filtro.columnasConCambio = (<string[]>val['columnas']);
      }

      // if (val['rangoFechas'] !== null) {
      //   this.formFiltros.get('rangoFechas')
      // }
    });
    this.formFiltros.get('rangoFechas').valueChanges.subscribe(value => {
      console.log('Rango changes');
    });
    this.construyeOpcionesOperaciones();
  }

  construyeOpcionesOperaciones(): void {
    this.operacionesSI = new Array<SelectItem>();
    this.operacionesSI.push({ label: 'Todas', value: null });
    this.operacionesSI.push({ label: 'Alta', value: 'I' });
    this.operacionesSI.push({ label: 'Cambio', value: 'U' });
    this.operacionesSI.push({ label: 'Eliminado', value: 'D' });
    this.operacionesSI.push({ label: 'Activación', value: 'AC' });
    this.operacionesSI.push({ label: 'Desactivación', value: 'IN' });
  }

  private initRangoFechas(): FormGroup {
    return this._builder.group({ 'finicio': [null], 'ffin': [null] });
  }

  private initColumnasControl(): FormControl {
    let control = this._builder.control([]);
    return control;
  }

  private initArrayLlaves(): FormArray {
    return this._builder.array(this.columnas.map(col => { this._builder.control(null); }));
  }

  consultarDetalles(idBitacora: any) {
    console.log('idBitacora', (+idBitacora));
  }

  setRangoFechas(rango: any) {
    console.log(JSON.stringify(rango));
    this.filtro.fechaInicial = (<Rango>rango).incio;
    this.filtro.fechaFinal = (<Rango>rango).fin;
  }

  loadCarsLazy(event: LazyLoadEvent) {
    if (event) {
      this.filtro.orden = this.filtro.orden || new Orden();
      this.filtro.orden.orden = (+event.sortOrder === 1 ? 'ASC' : 'DESC');
      this.filtro.orden.columnaOrden = event.sortField;
      this.filtro.paginador = this.filtro.paginador || new Paginador();
      this.filtro.paginador.inicio = +event.first;
      this.filtro.paginador.regPorPagina = +event.rows;
      this.consultaBitacora(this.filtro);
    } else {
      this.consultaBitacora();
    }
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
