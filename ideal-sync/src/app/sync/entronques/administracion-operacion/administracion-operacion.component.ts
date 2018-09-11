import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutopistasService, EntronquesService, ProcesosService, Autopista, Entronque } from '../shared/index';
import { CargandoService, MensajesService, ConfirmacionService, AuthService } from 'app/shared';
import { SelectItem } from 'primeng/primeng';

@Component({
    selector: 'i-sync-entronque-administracion-operacion',
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

    confEliminar = false;

    procesoForm: FormGroup;
    confirmarEjecucion = false;
    fHoy: Date;

    es: any;

    cols = [
        { header: 'Identificador', field: 'IdEntronque' },
        { header: 'Nombre', field: 'Descripcion' },
        { header: 'Estatus', field: 'Estatus' }
    ];

    constructor(private _builder: FormBuilder,
        private autopistasService: AutopistasService,
        private entronquesService: EntronquesService,
        private _procesosService: ProcesosService,
        private router: Router,
        private _cargandoService: CargandoService,
        private _mensajesSrv: MensajesService,
        private _dialogoConfirmacionService: ConfirmacionService,
        private _auth2Service: AuthService) { }


    ngOnInit() {
        this.autopistasSel = new Array<SelectItem>();
        this.autopistasSel.push({ label: 'Seleccione', value: String(0) });
        this.actualizaAutopistas();
        this.fHoy = new Date();
        const fHoyStr =
            `${this.fHoy.getDate() < 10 ? '0' : ''}${this.fHoy.getDate()}/${this.fHoy.getMonth() + 1}/${this.fHoy.getFullYear()}`;
        this.procesoForm = this._builder.group({
            fecha: [this.fHoy, Validators.required]
        });
        this.es = {
            firstDayOfWeek: 1,
            dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
            dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
            dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
            monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
            monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
            today: 'Hoy',
            clear: 'Borrar'
        };
    }

    private actualizaAutopistas() {
        this.autopistasService.getAutopistas()
            .then(autopistas => {
                this.autopistas = autopistas;
                this.autopistas.forEach(autopista => {
                    this.autopistasSel.push({ label: autopista.Nombre, value: autopista.Id });
                });
                this.autopistaSel = String(0);
            })
            .catch(error => {
                this._mensajesSrv.agregaError(error);
            });
    }

    editar() {
        this.router.navigate(['agencias', 'detalle', {
            idAutopista: this.entronqueSeleccionado.IdGrupo,
            id: this.entronqueSeleccionado.Id
        }]);
    }

    nuevo() {
        this.router.navigate(['agencias', 'detalle', { idAutopista: +this.autopistaSel }]);
    }

    get seleccionado() {
        return JSON.stringify(this.autopistaSeleccionada);
    }

    eliminar() {
        this._dialogoConfirmacionService.confirmar({
            encabezado: 'Confirmar',
            mensaje: 'Se elimará el registro del entronque y todos los datos de conexion', tipo: 'warn'
        })
            .subscribe(respuesta => {
                if (respuesta) {
                    this.entronquesService.delete(this.entronqueSeleccionado)
                        .then(r => {
                            if (r.status === 200) {
                                this._mensajesSrv.agregaInfo('Entronque eliminado correctamente');
                            } else {
                                this._mensajesSrv.agregaError('No fue posible eliminar la autopista, intente mas tarde.');
                            }
                            this.actualizaEntronques();
                        })
                        .catch(error => {
                            this._mensajesSrv.agregaError(error);
                        });
                }
            });
    }

    toogleActivo(): void {
        const enc = (!this.entronqueSeleccionado.Estatus ? 'Activar' : 'Desactivar') + ' entronque';
        const mens = `Se ${(!this.entronqueSeleccionado.Estatus ? 'activará' : 'desactivará')} el entronque, ¿Desea continuar? `;
        this._dialogoConfirmacionService.confirmar({ encabezado: enc, mensaje: mens, tipo: 'warn' })
            .subscribe(confirmado => {
                if (confirmado) {
                    console.log('Accion', 'Ejecuta rutina ' + enc);
                    this.entronquesService.toogleActivo(this.entronqueSeleccionado.Id, !this.entronqueSeleccionado.Estatus)
                        .then(entActualizado => {
                            this.entronqueSeleccionado = entActualizado;
                        })
                        .catch(error => {
                            this._mensajesSrv.agregaError('No fue posible activar el entronque. Consulta o enlace invalidos');
                        });
                }
            });
    }

    seleccionaAutopista() {
        if (+this.autopistaSel > 0) {
            this.autopistaSeleccionada = this.autopistas.find(a => a.Id === +this.autopistaSel);
            this.actualizaEntronques();
        } else {
            if (this.entronques) { this.entronques.length = 0; }
        }
    }

    actualizaEntronques() {
        this.entronquesService
            .getEntronqueByidAutopista(+this.autopistaSel)
            .then(entronques => {
                this.entronques = entronques; // .filter(e => this._auth2Service.hasPrivEntronque(e.Id));
            })
            .catch(error => {
                this._mensajesSrv.agregaError(error);
            });
    }

    cargarDatos() {
        this.router.navigate(['agencias', 'cargas', {
            idAutopista: this.entronqueSeleccionado.IdGrupo,
            id: this.entronqueSeleccionado.Id
        }]);
    }

    ejecutarSincronizacion(): void {
        this.confirmarEjecucion = true;
    }

    confirmaEjecucion() {
        const fProceso = <Date>this.procesoForm.get('fecha').value;
        console.log('Ejecuta:fecha', fProceso);
        this.confirmarEjecucion = false;
        this._procesosService.ejecutaProceso(this.entronqueSeleccionado.Id, fProceso)
            .then(mensaje => {
                this._mensajesSrv.agregaInfo(mensaje);
                this.procesoForm.reset();
            })
            .catch(error => {
                this._mensajesSrv.agregaError(error);
            });
    }

    cancelaEjecucion() {
        this.confirmarEjecucion = false;
    }
}
