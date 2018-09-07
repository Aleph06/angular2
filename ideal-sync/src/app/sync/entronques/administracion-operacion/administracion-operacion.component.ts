import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutopistasService, EntronquesService, ProcesosService, Autopista, Entronque } from '../shared/index';
import { CargandoService, MensajesService, DialogoConfirmacionService, Auth2Service, PrimeFacesLocales } from '../../../shared';
import { SelectItem } from 'primeng/primeng';

@Component({
    selector: 'entronque-administracion-operacion',
    templateUrl: 'administracion-operacion.component.html'
})
export class EntronqueAdminOperaComponent implements OnInit {

    autopistas: Autopista[] = new Array<Autopista>();
    autopistasSel: SelectItem[];
    autopistaSeleccionada: Autopista;
    autopistaSel: string;

    entronques: Entronque[];
    entronquesSel: SelectItem[];

    entronqueSeleccionado: Entronque;
    entronqueSel: SelectItem;

    confEliminar: boolean = false;

    procesoForm: FormGroup;
    confirmarEjecucion = false;
    fHoy: Date;

    es: any;

    constructor(private _builder: FormBuilder,
        private autopistasService: AutopistasService,
        private entronquesService: EntronquesService,
        private _procesosService: ProcesosService,
        private router: Router,
        private _cargandoService: CargandoService,
        private _mensajesSrv: MensajesService,
        private _dialogoConfirmacionService: DialogoConfirmacionService,
        private _auth2Service: Auth2Service) { }


    ngOnInit() {
        this.autopistasSel = new Array<SelectItem>();
        this.autopistasSel.push({ label: 'Seleccione', value: String(0) });
        this.actualizaAutopistas();
        this.fHoy = new Date();
        let fHoyStr = `${this.fHoy.getDate() < 10 ? '0' : ''}${this.fHoy.getDate()}/${this.fHoy.getMonth() + 1}/${this.fHoy.getFullYear()}`;
        this.procesoForm = this._builder.group({
            fecha: [this.fHoy, Validators.required]
        });
        this.es = PrimeFacesLocales.ES;
    }

    private actualizaAutopistas() {
        this._cargandoService.toggleLoadingIndicator(true);
        this.autopistasService.getAutopistas()
            .then(autopistas => {
                this.autopistas = autopistas;
                this.autopistas.forEach(autopista => {
                    this.autopistasSel.push({ label: autopista.Nombre, value: autopista.Id });
                });
                this.autopistaSel = String(0);
                this._cargandoService.toggleLoadingIndicator(false);
            })
            .catch(error => {
                this._mensajesSrv.agregaError(error);
                this._cargandoService.toggleLoadingIndicator(false);
            });
    }

    editar() {
        this.router.navigate(['/entronques/detalle', {
            idAutopista: this.entronqueSeleccionado.IdGrupo,
            id: this.entronqueSeleccionado.Id
        }]);
    }

    nuevo() {
        this.router.navigate(['/entronques/detalle', { idAutopista: +this.autopistaSel }]);
    }

    get seleccionado() {
        return JSON.stringify(this.autopistaSeleccionada);
    }

    eliminar() {
        this._dialogoConfirmacionService.confirmarBasic('Confirmar', 'Se elimará el registro del entronque y todos los datos de conexion')
            .then(respuesta => {
                if (respuesta) {
                    this._cargandoService.toggleLoadingIndicator(true);
                    this.entronquesService.delete(this.entronqueSeleccionado)
                        .then(r => {
                            if (r.status = 200) {
                                this._mensajesSrv.agregaMensaje('info', 'Confirmación', 'Entronque eliminado correctamente');
                            } else {
                                this._mensajesSrv.agregaMensaje('error', 'Error',
                                    'No fue posible eliminar la autopista, intente mas tarde.');
                            }
                            this._cargandoService.toggleLoadingIndicator(false);
                            this.actualizaEntronques();
                        })
                        .catch(error => {
                            this._mensajesSrv.agregaError(error);
                            this._cargandoService.toggleLoadingIndicator(false);
                        });
                }
            });
    }

    toogleActivo(): void {
        let enc = (!this.entronqueSeleccionado.Estatus ? 'Activar' : 'Desactivar') + ' entronque';
        let mens = `Se ${(!this.entronqueSeleccionado.Estatus ? 'activará' : 'desactivará')} el entronque, ¿Desea continuar? `;
        this._dialogoConfirmacionService.confirmarBasic(enc, mens)
            .then(confirmado => {
                if (confirmado) {
                    console.log('Accion', 'Ejecuta rutina ' + enc);
                    this._cargandoService.toggleLoadingIndicator(true);
                    this.entronquesService.toogleActivo(this.entronqueSeleccionado.Id, !this.entronqueSeleccionado.Estatus)
                        .then(entActualizado => {
                            this.entronqueSeleccionado = entActualizado;
                            this._cargandoService.toggleLoadingIndicator(false);
                        })
                        .catch(error => {
                            this._mensajesSrv.agregaError('No fue posible activar el entronque. Consulta o enlace invalidos');
                            // this._mensajesSrv.agregaError(error);
                        });
                }
            });
    }

    seleccionaAutopista() {
        if (+this.autopistaSel > 0) {
            this.actualizaEntronques();
        } else {
            if (this.entronques) { this.entronques.length = 0; }
        }
    }

    actualizaEntronques() {
        this._cargandoService.toggleLoadingIndicator(true);
        this.entronquesService
            .getEntronqueByidAutopista(+this.autopistaSel)
            .then(entronques => {
                this.entronques = entronques.filter(e => this._auth2Service.hasPrivEntronque(e.Id));
                this._cargandoService.toggleLoadingIndicator(false);
            })
            .catch(error => {
                this._mensajesSrv.agregaError(error);
                this._cargandoService.toggleLoadingIndicator(false);
            });
    }

    cargarDatos() {
        this.router.navigate(['/entronques/cargas', {
            idAutopista: this.entronqueSeleccionado.IdGrupo,
            id: this.entronqueSeleccionado.Id
        }]);
    }

    ejecutarSincronizacion(): void {
        this.confirmarEjecucion = true;
    }

    confirmaEjecucion() {
        console.log('Ejecuta', this.entronqueSeleccionado.IdGrupo + ' ' + this.entronqueSeleccionado.Id);
        console.log('Ejecuta:fecha', this.procesoForm.get('fecha').value);
        let fProceso = <Date>this.procesoForm.get('fecha').value;
        console.log('Ejecuta:fecha', fProceso);
        this.confirmarEjecucion = false;
        this._cargandoService.toggleLoadingIndicator(true);
        this._procesosService.ejecutaProceso(this.entronqueSeleccionado.Id, fProceso)
            .then(mensaje => {
                this._cargandoService.toggleLoadingIndicator(false);
                this._mensajesSrv.agregaMensaje('info', 'Confirmación', mensaje);
                this.procesoForm.reset();
            })
            .catch(error => {
                this._cargandoService.toggleLoadingIndicator(false);
                this._mensajesSrv.agregaError(error);
            });
    }

    cancelaEjecucion() {
        this.confirmarEjecucion = false;
    }

}
