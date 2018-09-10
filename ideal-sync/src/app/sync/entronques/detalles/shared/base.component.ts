import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Base, BasesService, MetadatosService } from '../../shared/index';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargandoService, ConfirmacionService, MensajesService } from '../../../../shared';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'i-sync-entronque-base',
    templateUrl: 'base.component.html'
})
export class BaseComponent implements OnInit {

    @Input() baseOrigen: Base;
    baseForm: FormGroup;
    @Output() sqlValid = new EventEmitter<Base>();

    constructor(private _builder: FormBuilder,
        private titleService: Title,
        private _cargandoService: CargandoService,
        private dialogoConfirmacionService: ConfirmacionService,
        private _mensajesSrv: MensajesService,
        private _basesService: BasesService,
        private _metadatosService: MetadatosService) { }

    ngOnInit() {
        this.titleService.setTitle('Ideal Sync- Entronques - Tablas, Campos, Mapeo, Filtros');
        this.buildForm();
        this.cargaBaseOrigen();
    }

    private cargaBaseOrigen(): void {
        this._basesService.getBaseByid(this.baseOrigen.Id)
            .then(bs => {
                this.baseOrigen = bs;
                this.fillForm();
            }).catch(error => { console.log(error); this._mensajesSrv.agregaError(error); });
    }

    buildForm(): void {
        this.baseForm = this._builder.group({
            sqlquery: [null, [Validators.required]]
        });
    }

    fillForm(): void {
        this.baseForm.get('sqlquery').setValue(this.baseOrigen.sql);
    }

    validarSQL() {
        const query = this.baseForm.get('sqlquery').value;
        this._metadatosService.getValidaConsulta(this.baseOrigen.IdEntronque, query)
            .then(() => {
                this.baseOrigen.Estatus = true;
                this.sqlValid.emit(this.baseOrigen);
            })
            .catch(error => {
                this.baseOrigen.Estatus = false;
                this.sqlValid.emit(this.baseOrigen);
                this._mensajesSrv.agregaError(error);
            });
    }

}
