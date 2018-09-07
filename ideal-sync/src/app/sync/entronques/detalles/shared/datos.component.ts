import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
    Entronque, AutopistasService, Autopista, EnlacesService, Conexion, Base,
    EntronquesService, BasesService, MetadatosService
} from '../../shared/index';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { CargandoService, MensajesService, DialogoConfirmacionService } from '../../../../shared/index';

@Component({
    selector: 'entronque-datos',
    templateUrl: 'datos.component.html'
})
export class DatosComponent implements OnInit {

    @Input() entronque: Entronque;
    @Output() entronqueNuevo = new EventEmitter();
    datosForm: FormGroup;
    enlaceForm: FormGroup;
    autopistaSI: SelectItem[];
    tablasSI: SelectItem[];
    autopistas: Autopista[];
    esConexionCorrecta = false;
    tiposEnlace: SelectItem[];
    verContrasenia: boolean = false;

    constructor(private _builder: FormBuilder,
        private _autopistasService: AutopistasService,
        private _cargandoService: CargandoService,
        private _enlacesService: EnlacesService,
        private _entronquesService: EntronquesService,
        private _basesService: BasesService,
        private _metadatosSrv: MetadatosService,
        private _mensajesSrv: MensajesService,
        private _dialogoConfirmacionService: DialogoConfirmacionService) { }

    ngOnInit() {
        this.buildItemsTipo();
        this.buildItemsAutopistas();
        this.buildItemsTablasDestino();
        this.buildForms();
        if (this.entronque.Id > 0) {
            this.cargaConexion();
        }
    }

    private cargaConexion(): void {
        this._enlacesService.getEnlaceByid(this.entronque.IdEnlace)
            .then(conexion => {
                this.entronque.conexion = conexion;
                this.cargaBaseOrigen();
            }).catch(error => { console.log(error); this._mensajesSrv.agregaError(error); });
    }

    private cargaBaseOrigen(): void {
        this._basesService.getBaseByid(this.entronque.IdbaseOrigen)
            .then(bs => {
                this.entronque.baseOrigen = bs;
                this.cargaBaseDestino();
            }).catch(error => { console.log(error); this._mensajesSrv.agregaError(error); });
    }

    private cargaBaseDestino(): void {
        this._basesService.getBaseByid(this.entronque.IdbaseDestino)
            .then(bs => {
                this.entronque.baseDestino = bs;
                this.fillForms();
            }).catch(error => { console.log(error); this._mensajesSrv.agregaError(error); });
    }

    registraEntronque(): void {
        if (this.entronque.Id > 0) {
            this.confirmarActualizar();
        } else {
            this.confirmarAgregar();
        }
    }

    toogleVerContrasenia() {
        this.verContrasenia = !this.verContrasenia;
    }

    private buildItemsAutopistas(): void {
        this.autopistaSI = new Array<SelectItem>();
        this.autopistaSI.push({ label: 'Seleccione', value: null });
        this._cargandoService.toggleLoadingIndicator(true);
        this._autopistasService.getAutopistas()
            .then(autopistas => {
                this.autopistas = autopistas;
                autopistas.forEach(a => {
                    this.autopistaSI.push({ value: a.Id, label: a.Nombre });
                });
                this._cargandoService.toggleLoadingIndicator(false);
            })
            .catch(error => {
                console.log(error); this._mensajesSrv.agregaError(error);
                this._cargandoService.toggleLoadingIndicator(false);
            });
    }

    private buildItemsTablasDestino(): void {
        this.tablasSI = new Array<SelectItem>();
        this.tablasSI.push({ label: 'Seleccione', value: null });
        this._cargandoService.toggleLoadingIndicator(true);
        this._metadatosSrv.getTablasDestino()
            .then(tablas => {
                tablas.forEach(tabla => {
                    this.tablasSI.push({ label: tabla, value: tabla });
                });
            })
            .catch(error => {
                console.log(error); this._mensajesSrv.agregaError(error);
                this._cargandoService.toggleLoadingIndicator(false);
            });
    }

    private buildItemsTipo(): void {
        this.tiposEnlace = new Array<SelectItem>();
        this.tiposEnlace.push({ label: 'SQL Server', value: 1 });
        this.tiposEnlace.push({ label: 'Oracle', value: 2 });
    }

    setTipo(idtipo: any) {
        console.log('tipo', +idtipo);
        if (+idtipo === 2) {
            this.enlaceForm.addControl('puerto', new FormControl(null, [Validators.required, Validators.pattern(`^[0-9]{4}$`)]));
        } else {
            if (this.enlaceForm.contains('puerto')) {
                this.enlaceForm.removeControl('puerto');
            }
        }
    }

    private buildForms(): void {
        this.datosForm = this._builder.group({
            tipoEnlace: new FormControl(1, [Validators.required]),
            idAutopista: new FormControl(null, [Validators.required]),
            nombre: new FormControl(null, [Validators.required]),
            idEntronque: new FormControl(null, [Validators.required, Validators.pattern(`^[0-9]+$`)]),
            tablaDestino: new FormControl(null, [Validators.required]),
        });
        this.enlaceForm = this._builder.group({
            ip: new FormControl(null, [Validators.required,
            Validators.pattern(`^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$`)]),
            usuario: new FormControl(null, [Validators.required]),
            contrasena: new FormControl(null, [Validators.required]),
            base: new FormControl(null, [Validators.required]),
        });
    }

    private fillForms() {
        this.datosForm.get('idAutopista').setValue(this.entronque.IdGrupo);
        this.datosForm.get('nombre').setValue(this.entronque.Descripcion);
        this.datosForm.get('idEntronque').setValue(this.entronque.IdEntronque);
        this.datosForm.get('tablaDestino').setValue(this.entronque.baseDestino.Tabla);
        if (this.entronque.conexion !== null && (typeof this.entronque.conexion !== 'undefined')) {
            this.enlaceForm.get('ip').setValue(this.entronque.conexion.DireccionIP);
            this.enlaceForm.get('usuario').setValue(this.entronque.conexion.Usuario);
            this.enlaceForm.get('contrasena').setValue(this.entronque.conexion.Contrasena);
        }
        if (this.entronque.baseOrigen !== null && (typeof this.entronque.baseOrigen !== 'undefined')) {
            this.enlaceForm.get('base').setValue(this.entronque.baseOrigen.BaseDeDatos);
        }
        if (this.entronque.conexion.URL !== null && (typeof this.entronque.conexion.URL !== 'undefinded')
            && (this.entronque.conexion.URL.length > 0)) {
            this.enlaceForm.addControl('puerto',
                this._builder.control(this.entronque.conexion.URL, [Validators.required, Validators.pattern(`^[0-9]{4}$`)]));
        }
    }

    confirmarAgregar(): void {
        this._dialogoConfirmacionService.confirmarBasic('Confirmación',
            `Se creará el entronque: ${this.datosForm.get('nombre').value}.
            ¿Desea continuar?`)
            .then(respuesta => {
                if (respuesta) {
                    if (this.datosForm.valid) {
                        let entronque = new Entronque(-1, String(this.datosForm.get('nombre').value),
                            false, +this.datosForm.get('idAutopista').value, this.datosForm.get('idEntronque').value);
                        this._cargandoService.toggleLoadingIndicator(true);
                        this.guardarEntronque(entronque)
                            .then(entronqueNuevo => {
                                let baseDestino = new Base(-1, 'IdealRepositorioData', this.datosForm.get('tablaDestino').value, null);
                                baseDestino.IdEntronque = entronqueNuevo.Id;
                                this.guardarBase(baseDestino)
                                    .then(base => {
                                        entronqueNuevo.IdbaseDestino = base.Id;
                                        entronqueNuevo.baseDestino = base;
                                        this.entronque = Object.assign({}, entronqueNuevo);
                                        this.guardarEntronque(entronqueNuevo)
                                            .then(entronqueFinal => {
                                                this.entronque = Object.assign({}, entronqueFinal);
                                                this._cargandoService.toggleLoadingIndicator(false);
                                                if (this.enlaceForm.valid && this.enlaceForm.dirty) {
                                                    this.comprobarEnlace(entronqueFinal);
                                                } else {
                                                    this.onEnlaceError();
                                                }
                                            });
                                    })
                                    .catch(error => {
                                        this._mensajesSrv.agregaError(error);
                                        this._cargandoService.toggleLoadingIndicator(false);
                                    });
                            })
                            .catch(error => {
                                this._mensajesSrv.agregaError(error);
                                this._cargandoService.toggleLoadingIndicator(false);
                            });
                    }
                }
            });
    }

    confirmarActualizar(): void {
        console.log('actual', this.entronque.baseDestino);
        this._dialogoConfirmacionService.confirmarBasic('Confirmación',
            `Se actualizarán los datos del entronwque: ${this.datosForm.get('nombre').value}.
            ¿Desea continuar?`)
            .then(respuesta => {
                if (respuesta) {
                    if (this.datosForm.valid) {
                        console.log('actual', this.entronque.baseDestino);
                        this.entronque.IdGrupo = +this.datosForm.get('idAutopista').value;
                        this.entronque.Descripcion = String(this.datosForm.get('nombre').value);
                        this.entronque.IdEntronque = String(this.datosForm.get('idEntronque').value);
                        let entActualizar = Object.assign({}, this.entronque);
                        this._cargandoService.toggleLoadingIndicator(true);
                        this.guardarEntronque(entActualizar)
                            .then(entronqueActual => {
                                if (this.datosForm.get('tablaDestino').dirty) {
                                    console.log('actual', this.entronque.baseDestino);
                                    entronqueActual.baseDestino = this.entronque.baseDestino;
                                    entronqueActual.conexion = this.entronque.conexion;
                                    entronqueActual.baseOrigen = this.entronque.baseOrigen;
                                    // this.entronque = entronqueActual;
                                    console.log('actual', entronqueActual.baseDestino);
                                    entronqueActual.baseDestino.Tabla = this.datosForm.get('tablaDestino').value;
                                    this.guardarBase(entronqueActual.baseDestino)
                                        .then(base => {
                                            entronqueActual.IdbaseDestino = base.Id;
                                            entronqueActual.baseDestino = base;
                                            this.entronque = entronqueActual;
                                            this._cargandoService.toggleLoadingIndicator(false);
                                            if (this.enlaceForm.valid && this.enlaceForm.dirty) {
                                                this.comprobarEnlace(entronqueActual);
                                            } else {
                                                this.onEnlaceError();
                                            }
                                        })
                                        .catch(error => {
                                            this._mensajesSrv.agregaError(error);
                                            this._cargandoService.toggleLoadingIndicator(false);
                                        });
                                } else {
                                    this._cargandoService.toggleLoadingIndicator(false);
                                    if (this.enlaceForm.valid && this.enlaceForm.dirty) {
                                        this.comprobarEnlace(entronqueActual);
                                    } else {
                                        this.onEnlaceError();
                                    }
                                }
                            }).catch(error => {
                                this._mensajesSrv.agregaError(error);
                                this._cargandoService.toggleLoadingIndicator(false);
                            });
                    }
                }
            });
    }

    private guardarEntronque(entronque: Entronque): Promise<Entronque> {
        return this._entronquesService.save(entronque)
            .then(e => { return Promise.resolve(e); })
            .catch(error => { console.log(error); Promise.reject(error) });
    }

    private guardarBase(base: Base): Promise<Base> {
        return this._basesService.save(base)
            .then(b => Promise.resolve(b))
            .catch(error => { console.log(error); Promise.reject(error); });
    }

    private comprobarEnlace(entronque: Entronque): void {
        console.log('Comprobar enlace: init');
        this._cargandoService.toggleLoadingIndicator(true);
        if (this.enlaceForm.valid) {
            if (this.enlaceForm.get('base').dirty) {
                if (entronque.IdbaseOrigen <= 0) {
                    entronque.baseOrigen = new Base(-1, null, '');
                }
                entronque.baseOrigen.IdEntronque = entronque.Id;
                entronque.baseOrigen.BaseDeDatos = String(this.enlaceForm.get('base').value);
                console.log('baseN', JSON.stringify(entronque.baseOrigen));
                this.guardarBase(entronque.baseOrigen)
                    .then(base => {
                        if (base && base.Id > 0) {
                            console.log('base', JSON.stringify(base));
                            entronque.IdbaseOrigen = base.Id;
                            this.guardarEntronque(entronque)
                                .then(entronqueFinal => {
                                    this.entronque = Object.assign({}, entronqueFinal);
                                    this.pruebaEnlace()
                                        .then(id => {
                                            this._cargandoService.toggleLoadingIndicator(false);
                                            if (id > 0) {
                                                this.onEnlaceOK(id);
                                            } else {
                                                this.onEnlaceError();
                                            }
                                        })
                                        .catch(error => {
                                            this.onEnlaceError();
                                            this._cargandoService.toggleLoadingIndicator(false);
                                        });
                                });

                        }
                    })
                    .catch(error => {
                        this._mensajesSrv.agregaError(error);
                        this._cargandoService.toggleLoadingIndicator(false);
                    });
            } else {
                console.log('base', JSON.stringify(this.entronque.baseOrigen));
                this.pruebaEnlace()
                    .then(id => {
                        this._cargandoService.toggleLoadingIndicator(false);
                        if (id > 0) {
                            this.onEnlaceOK(id);
                        } else {
                            this.onEnlaceError();
                        }
                    })
                    .catch(error => {
                        this.onEnlaceError();
                        this._cargandoService.toggleLoadingIndicator(false);
                    });
            }
        }
    }

    private pruebaEnlace(): Promise<number> {
        this._cargandoService.toggleLoadingIndicator(true);
        let enlace: Conexion;
        if (this.entronque.conexion !== null && (typeof this.entronque.conexion !== 'undefined')) {
            enlace = this.entronque.conexion;
        } else {
            enlace = new Conexion(-1, null, null, null, null, 0);
        }
        enlace.DireccionIP = this.enlaceForm.get('ip').value;
        enlace.Usuario = this.enlaceForm.get('usuario').value;
        enlace.Contrasena = this.enlaceForm.get('contrasena').value;
        enlace.URL = (this.enlaceForm.contains('puerto') ? this.enlaceForm.get('puerto').value : null);
        enlace.IdEntronque = this.entronque.Id;
        return this._enlacesService.testEnlace(enlace)
            .then(conn => {
                this._cargandoService.toggleLoadingIndicator(false);
                return conn.Id;
            })
            .catch(error => { console.log(error); this._cargandoService.toggleLoadingIndicator(false); return Promise.reject(error); });
    }

    onEnlaceOK(idEnlace: number): void {
        console.log('entronque', JSON.stringify(this.entronque));
        console.log('idEnlace', JSON.stringify(idEnlace));
        this._cargandoService.toggleLoadingIndicator(true);
        this.entronque.IdEnlace = idEnlace;
        this.guardarEntronque(this.entronque)
            .then(entronqueGuardado => {
                this._cargandoService.toggleLoadingIndicator(false);
                console.log('nuevo', JSON.stringify(entronqueGuardado));
                this.entronque = entronqueGuardado;
                this.entronqueNuevo.emit({ evento: 'entronque', entronque: this.entronque });
                console.log('nuevo', JSON.stringify(this.entronque));
            }).catch(error => {
                console.error('Error al agregar', error);
                this.entronqueNuevo.emit({ evento: 'error', error: error });
                this._cargandoService.toggleLoadingIndicator(false);
            });
    }

    onEnlaceError(): void {
        console.log('sinEnlace', JSON.stringify(this.entronque));
        this.entronqueNuevo.emit({ evento: 'sinEnlace', entronque: this.entronque });
    }
}
