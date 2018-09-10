import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutopistasService, EntronquesService } from '../servicios/index';
import { Entronque } from '../modelos/index';
import { CargandoService, MensajesService, AuthService } from 'app/shared';
import { SelectItem } from 'primeng/primeng';

@Component({
    selector: 'i-sync-selector-entronque',
    templateUrl: 'selector-entronque.component.html'
})
export class SelectorEntronqueComponent implements OnInit {

    selectorForm: FormGroup;
    autopistasItems: SelectItem[];
    entronquesItems: SelectItem[];
    private nullItem: SelectItem = { label: 'Seleccione...', value: null };
    @Input('entronque') private entronque: Entronque;
    @Output() change = new EventEmitter<Entronque>();
    @Input('showEntronques') showEntronques = true;

    constructor(private _autopistasSrv: AutopistasService,
        private _entronquesSrv: EntronquesService,
        private _builder: FormBuilder,
        private _cargandoService: CargandoService,
        private _mensajesSrv: MensajesService,
        private _authService: AuthService) { }

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
        this._autopistasSrv.getAutopistas()
            .then(autopistas => {
                autopistas.forEach(autopista => {
                    this.autopistasItems.push({ value: autopista.Id, label: autopista.Nombre });
                });
            })
            .catch(error => {
                this._mensajesSrv.agregaError(error);
            });
    }

    seleccionaAutopista() {
        if (this.selectorForm.get('idAutopistaStr').valid) {
            const idAutopista = +this.selectorForm.get('idAutopistaStr').value;
            this.cargaEntronquesDeAutopista(idAutopista);
            this.change.emit(null);
        }
    }

    cargaEntronquesDeAutopista(idAutopista: number) {
        this.entronquesItems = new Array<SelectItem>();
        this.entronquesItems.push(this.nullItem);
        this._entronquesSrv.getEntronqueByidAutopista(idAutopista)
            .then(entronques => {
                entronques.forEach(entronque => {
                    // if (this._authService.hasPrivEntronque(entronque.Id)) {
                        this.entronquesItems.push({ value: entronque.Id, label: entronque.Descripcion });
                    // }
                });
                if (!this.showEntronques) {
                    if (this.entronquesItems.length > 1) {
                        this.selectorForm.get('idEntronqueStr').setValue(String(this.entronquesItems[1].value));
                        this.seleccionaEntronque();
                    } else {
                        this._mensajesSrv.agregaWarn('Autopista no tiene entronques registrados');
                    }
                }
            })
            .catch(error => {
                this._mensajesSrv.agregaError(error);
            });
    }

    seleccionaEntronque() {
        if (this.selectorForm.valid) {
            const idAutopista = +this.selectorForm.get('idAutopistaStr').value;
            const idEntronque = +this.selectorForm.get('idEntronqueStr').value;
            this._entronquesSrv.getEntronqueByidAutopistaId(idAutopista, idEntronque)
                .then(entronque => {
                    this.change.emit(entronque);
                })
                .catch(error => {
                    this._mensajesSrv.agregaError(error);
                });
        }
    }
}
