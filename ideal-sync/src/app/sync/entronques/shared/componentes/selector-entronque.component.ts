import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutopistasService, EntronquesService } from '../servicios/index';
import { Entronque } from '../modelos/index';
import { CargandoService, MensajesService, Auth2Service } from '../../../../shared/index';
import { SelectItem } from 'primeng/primeng';

@Component({
    selector: 'selector-entronque',
    templateUrl: 'selector-entronque.component.html'
})
export class SelectorEntronqueComponent implements OnInit {

    selectorForm: FormGroup;
    autopistasItems: SelectItem[];
    entronquesItems: SelectItem[];
    private nullItem: SelectItem = { label: 'Seleccione...', value: null };
    @Input('entronque') private entronque: Entronque;
    @Output() onChange = new EventEmitter<Entronque>();
    @Input('showEntronques') showEntronques: boolean = true;

    constructor(private _autopistasSrv: AutopistasService,
        private _entronquesSrv: EntronquesService,
        private _builder: FormBuilder,
        private _cargandoService: CargandoService,
        private _mensajesSrv: MensajesService,
        private _authService: Auth2Service) { }

    ngOnInit(): void {
        console.log('entroque:init', this.entronque);
        this.selectorForm = this._builder.group({
            idAutopistaStr: [(this.entronque && this.entronque != null ? this.entronque.IdGrupo : null), Validators.required],
            idEntronqueStr: [(this.entronque && this.entronque != null ? this.entronque.Id : null), Validators.required]
        });
        this.autopistasItems = new Array<SelectItem>();
        this.autopistasItems.push(this.nullItem);
        this.creaItemsAutopista();
        this.initEntronque();
    }

    private initEntronque(): void {
        if ((this.entronque !== null && this.entronque !== undefined)
            && (this.selectorForm !== null && this.selectorForm !== undefined)) {
            this.selectorForm.get('idAutopistaStr').setValue(String(this.entronque.IdGrupo));
            this.cargaEntronquesDeAutopista(this.entronque.IdGrupo);
            this.selectorForm.get('idEntronqueStr').setValue(String(this.entronque.Id));
            // this.seleccionaEntronque();
        }
    }

    private creaItemsAutopista(): void {
        this._cargandoService.toggleLoadingIndicator(true);
        this._autopistasSrv.getAutopistas()
            .then(autopistas => {
                autopistas.forEach(autopista => {
                    this.autopistasItems.push({ value: autopista.Id, label: autopista.Nombre });
                });
                this._cargandoService.toggleLoadingIndicator(false);
            })
            .catch(error => {
                this._mensajesSrv.agregaError(error);
                this._cargandoService.toggleLoadingIndicator(false);
            });
    }

    seleccionaAutopista() {
        if (this.selectorForm.get('idAutopistaStr').valid) {
            let idAutopista = +this.selectorForm.get('idAutopistaStr').value;
            this.cargaEntronquesDeAutopista(idAutopista);
            this.onChange.emit(null);
        }
    }

    cargaEntronquesDeAutopista(idAutopista: number) {
        this._cargandoService.toggleLoadingIndicator(true);
        this.entronquesItems = new Array<SelectItem>();
        this.entronquesItems.push(this.nullItem);
        this._entronquesSrv.getEntronqueByidAutopista(idAutopista)
            .then(entronques => {
                entronques.forEach(entronque => {
                    if (this._authService.hasPrivEntronque(entronque.Id)) {
                        this.entronquesItems.push({ value: entronque.Id, label: entronque.Descripcion });
                    }
                });
                if (!this.showEntronques) {
                    if (this.entronquesItems.length > 1) {
                        this.selectorForm.get('idEntronqueStr').setValue(String(this.entronquesItems[1].value));
                        this.seleccionaEntronque();
                    } else {
                        this._mensajesSrv.agregaWarn('Error', 'Autopista no tiene entronques registrados');
                        this._cargandoService.toggleLoadingIndicator(false);
                    }
                } else {
                    this._cargandoService.toggleLoadingIndicator(false);
                }
            })
            .catch(error => {
                this._mensajesSrv.agregaError(error);
                this._cargandoService.toggleLoadingIndicator(false);
            });
    }

    seleccionaEntronque() {
        if (this.selectorForm.valid) {
            this._cargandoService.toggleLoadingIndicator(true);
            let idAutopista = +this.selectorForm.get('idAutopistaStr').value;
            let idEntronque = +this.selectorForm.get('idEntronqueStr').value;
            this._entronquesSrv.getEntronqueByidAutopistaId(idAutopista, idEntronque)
                .then(entronque => {
                    this.onChange.emit(entronque);
                    this._cargandoService.toggleLoadingIndicator(false);
                })
                .catch(error => {
                    this._mensajesSrv.agregaError(error);
                    this._cargandoService.toggleLoadingIndicator(false);
                });
        }
    }
}
