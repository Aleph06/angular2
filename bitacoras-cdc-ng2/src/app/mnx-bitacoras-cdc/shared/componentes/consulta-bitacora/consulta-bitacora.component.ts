import { Component, OnInit, Input, Inject, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormArray, FormGroup } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { SelectItem, LazyLoadEvent } from 'primeng/components/common/api';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { BitacorasService, TablasBitacoraService } from '../../servicios';
import { DetallesBitacoraDialogoComponent } from '../detalles-bitacora-dialogo/detalles-bitacora-dialogo.component';
import { TablaOrigen, Orden, Paginador, Filtro } from '../../modelos';
import { CargandoService, MensajesService } from '../../../../shared';

@Component({
  selector: 'mnx-bitacoras-cdc-consulta-bitacora',
  templateUrl: './consulta-bitacora.component.html',
  providers: [BitacorasService]
})
export class ConsultaBitacoraComponent implements OnInit {

  @Input()
  public idTabOrigen: number;
  public tablaOrigen: TablaOrigen;
  formFiltros: FormGroup;
  registrosBitacora: any[];
  columnas: any[];
  totalRegistros: number;
  operacionesSI: SelectItem[];
  filtro: Filtro;
  lastFormValue: any;
  private searchTermStream = new Subject<string>();
  items: Observable<string[]> = this.searchTermStream
    .debounceTime(500)
    .distinctUntilChanged()
    .switchMap((busqueda: string) => {
      this.formFiltros.get('columnas').disable();
      return this._bitacorasSrv
        .getDescripcionesColumnas(busqueda, this.tablaOrigen.esquemaTabOrigen, this.tablaOrigen.nomTabOrigen)
        .finally(() => { this.formFiltros.get('columnas').enable(); });
    });
  // RANGO
  finMinDate: string;
  finMaxDate: string = '+0d';
  inicioMinDate: string;
  inicioMaxDate: string = '+0d';
  reload: boolean = false;
  @ViewChild(DetallesBitacoraDialogoComponent)
  private detallesBitacora: DetallesBitacoraDialogoComponent;

  constructor(private _cargandoService: CargandoService,
    private _mensajesSrv: MensajesService,
    private _tblBitSrv: TablasBitacoraService,
    private _bitacorasSrv: BitacorasService,
    private _route: ActivatedRoute,
    private _location: Location,
    @Inject('locale') public locale: { [key: string]: any },
    private _builder: FormBuilder,
    private _titleSrv: Title) { }

  ngOnInit() {
    if (this.idTabOrigen === null || (typeof this.idTabOrigen === 'undefined')) {
      this._route.params.forEach((params: Params) => {
        this.selectTabOrigen(+params['idTabOrigen']);
      });
    }
  }

  selectTabOrigen(idTabOrigen: number, reload?: boolean): void {
    console.log('selectTabOrigen', idTabOrigen);
    if (idTabOrigen > 0) {
      this.idTabOrigen = idTabOrigen;
      this.getTablaOrigen();
      if (reload) {
        this.reload = reload;
      }
    }
  }

  getTablaOrigen(): void {
    console.log('getTablaOrigen', isNaN(this.idTabOrigen));
    if (!isNaN(this.idTabOrigen)) {
      this._tblBitSrv.getByidTabOrigen(this.idTabOrigen)
        .then(tablaBit => {
          console.log('SelectorBitacoraComponent:tablaBit', tablaBit);
          this.tablaOrigen = tablaBit.idTabOrigen;
          this._titleSrv.setTitle(`Bitácoras CDC - Consulta ${this.tablaOrigen.nomTabOrigen}`);
          console.log('SelectorBitacoraComponent:tablaOrigen', tablaBit.idTabOrigen);
          this.construyeFiltros();
        })
        .catch(error => this.handleError(error));
    } else {
      this.tablaOrigen = null;
    }
  }

  buscaColumnas(busqueda: any) {
    console.log('busqueda', busqueda.query);
    this.searchTermStream.next(busqueda.query);
  }

  consultaBitacora(filtro?: Filtro): void {
    console.log(`Bitacora: {${this.tablaOrigen.esquemaTabOrigen} - ${this.tablaOrigen.nomTabOrigen}}`);
    this._cargandoService.toggleLoadingIndicator(true);
    this._bitacorasSrv.getByTablaEsquemaFiltros(this.tablaOrigen.nomTabOrigen, this.tablaOrigen.esquemaTabOrigen, filtro)
      .then(bitacora => {
        this.registrosBitacora = new Array<{ [key: string]: string }>();
        let reg: { [key: string]: string } = {};
        console.log('registros', JSON.stringify(bitacora['registros']));
        if (typeof bitacora['registros'] !== 'undefined') {
          (bitacora['registros'] as any[]).forEach(r => {
            (r['campo'] as any[]).forEach(rc => {
              reg[rc['columna']] = rc['valor'];
            });
            this.registrosBitacora.push(Object.assign({}, reg));
          });
        }
        console.log(`registros`, JSON.stringify(this.registrosBitacora));
        this.columnas = (bitacora['columnas'] as any[])
          .filter(c => (c['nombre'] !== 'CVE_ENTIDAD' && c['llavePrimaria'] === 'true'))
          .map<any>(c => { return { field: c['nombre'], header: c['descripcion'] }; });
        console.log(`columnas`, JSON.stringify(this.columnas));
        this.buildLlavesFilter();
        this.totalRegistros = +bitacora['@totalRegistros'];
        console.log(`totalRegistros`, JSON.stringify(this.totalRegistros));
        this._cargandoService.toggleLoadingIndicator(false);
      })
      .catch(error => this.handleError(error));
  }

  construyeFiltros() {
    this.formFiltros = this._builder.group({
      operacion: [null],
      columnas: this.initColumnasControl(),
      descUsuario: [null],
      finicio: [null],
      ffin: [null],
      llaves: this.initArrayLlaves()
    });
    this.initFiltro();
    this.attachEvent();
    this.construyeOpcionesOperaciones();
    if (this.reload) {
      this.loadBitacoraLazy();
    }
  }

  private initFiltro(): void {
    this.filtro = new Filtro();
    this.filtro.orden = new Orden();
    this.filtro.paginador = new Paginador();
    this.filtro.llaves = {};
  }

  private attachEvent(): void {
    this.formFiltros.valueChanges.subscribe(val => {
      console.log('formFiltros.value', JSON.stringify(val));
      let filtroN = new Filtro();
      filtroN.orden = this.filtro.orden;
      filtroN.paginador = this.filtro.paginador;
      filtroN.llaves = {};
      if (val['operacion'] !== null) {
        filtroN.operacion = val['operacion'];
      }
      if (val['descUsuario'] !== null && (<string>val['descUsuario']).length > 5) {
        filtroN.usuario = val['descUsuario'];
      }
      if (val['columnas'] !== null && ((typeof val['columnas']) !== 'undefined')) {
        filtroN.columnasConCambio = (<string[]>val['columnas']);
      }
      console.log('filtroN    ', JSON.stringify(filtroN.columnasConCambio));
      console.log('this.filtro', JSON.stringify(this.filtro.columnasConCambio));
      let fi: Date;
      if (val['finicio'] !== null) {
        fi = this.strToDate(val['finicio']);
        this.finMinDate = this.calculaStringDif(fi);
      }
      let ff: Date;
      if (val['ffin'] !== null) {
        ff = this.strToDate(val['ffin']);
        this.inicioMaxDate = this.calculaStringDif(ff);
      }
      if (val['ffin'] !== null && val['finicio'] !== null) {
        filtroN.fechaInicial = fi;
        filtroN.fechaFinal = ff;
      }
      if (val['llaves'] !== null && val['llaves'].length > 0) {
        let idx = 0;
        let valLlaves = <string>val['llaves'];
        for (let col in this.columnas) {
          if (this.columnas.hasOwnProperty(col)) {
            if (valLlaves[idx] !== null && (typeof valLlaves[idx] !== 'undefined')) {
              filtroN.llaves[this.columnas[col].field] = valLlaves[idx].toUpperCase();
            }
            idx++;
          }
        }
      }
      // console.log('filtroN    ', JSON.stringify(filtroN.columnasConCambio));
      // console.log('this.filtro', JSON.stringify(this.filtro.columnasConCambio));
      if (!filtroN.equals(this.filtro)) {
        this.filtro = Object.assign({}, filtroN);
        this.consultaBitacora(this.filtro);
      }
    });
  }

  private construyeOpcionesOperaciones(): void {
    this.operacionesSI = new Array<SelectItem>();
    this.operacionesSI.push({ label: 'Todas', value: null });
    this.operacionesSI.push({ label: 'Alta', value: 'I' });
    this.operacionesSI.push({ label: 'Cambio', value: 'U' });
    this.operacionesSI.push({ label: 'Eliminado', value: 'D' });
    this.operacionesSI.push({ label: 'Activación', value: 'AC' });
    this.operacionesSI.push({ label: 'Desactivación', value: 'IN' });
  }

  private initColumnasControl(): FormControl {
    let control = this._builder.control([]);
    return control;
  }

  private initArrayLlaves(): FormArray {
    return this._builder.array([]);
  }

  buildLlavesFilter(): void {
    this.columnas
      .map<FormControl>(col => this._builder.control(null))
      .forEach((colControl, idx) => {
        this.addControltoLlaves(colControl);
      });
  }

  addControltoLlaves(control: FormControl): void {
    (<FormArray>this.formFiltros.get('llaves')).push(control);
    ;
  }

  consultarDetalles(idBitacora: any) {
    console.log('idBitacora', (+idBitacora));
    this.detallesBitacora.cargaDetalles(+idBitacora);
  }

  loadBitacoraLazy(event?: LazyLoadEvent) {
    if (event) {
      this.filtro.orden = (typeof this.filtro !== 'undefined' ? (this.filtro.orden || new Orden()) : new Orden());
      this.filtro.orden.orden = (+event.sortOrder === 1 ? 'ASC' : 'DESC');
      this.filtro.orden.columnaOrden = event.sortField;
      this.filtro.paginador = (typeof this.filtro !== 'undefined' ? (this.filtro.paginador || new Paginador()) : new Paginador());
      this.filtro.paginador.inicio = +event.first;
      this.filtro.paginador.regPorPagina = +event.rows;
      this.consultaBitacora(this.filtro);
    } else {
      this.consultaBitacora();
    }
  }

  resetFiltros(): void {
    this.formFiltros.reset();
    this.initFiltro();
    this.finMinDate = null;
    this.finMaxDate = '+0d';
    this.inicioMinDate = null;
    this.inicioMaxDate = '+0d';
    this.loadBitacoraLazy();
  }

  onUnselect() {
    this.consultaBitacora(this.filtro);
  }

  strToDate(value): Date {
    let farray = String(value).split('/');
    return new Date((+farray[2]), (+farray[1]) - 1, (+farray[0]));
  }

  private calculaStringDif(fecha: Date): string {
    let difStr: string;
    let hoy = new Date();
    hoy.setHours(0);
    hoy.setMinutes(0);
    hoy.setSeconds(0);
    hoy.setMilliseconds(0);
    let dif = Math.round((hoy.valueOf() - fecha.valueOf()) / (1000 * 60 * 60 * 24));
    if (dif >= 0) {
      difStr = `-${String(dif)}d`;
    }
    return difStr;
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
