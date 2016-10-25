import { Component, Input, Inject, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Rango } from './rango';

@Component({
    selector: 'mnx-bitacoras-cdc-rango-fechas',
    template: `
    <div *ngIf="rangoForm.contains('finicio') && rangoForm.contains('ffin')" [formGroup]="rangoForm">
        <p-calendar formControlName="finicio" [minDate]="inicioMinDate" [maxDate]="inicioMaxDate"
         [readonlyInput]="true" [locale]="locale"></p-calendar>
        <p-calendar formControlName="ffin" [minDate]="finMinDate" [maxDate]="finMaxDate"
         [readonlyInput]="true" [locale]="locale"></p-calendar>
    </div>`,
    styles: [`p-calendar.ng-dirty.ng-invalid input.hasDatepicker { border-style: solid; border-left: thick double #ff0000; }`]
})
export class RangoFechasComponent implements OnInit {

    @Input()
    public rangoForm: FormGroup;
    rango: Rango;
    @Output()
    setRango = new EventEmitter<Rango>();

    finMinDate: string;
    finMaxDate: string;
    inicioMinDate: string;
    inicioMaxDate: string;

    constructor( @Inject('locale') public locale: { [key: string]: any },
        private _builder: FormBuilder) { }

    ngOnInit(): void {
        console.log('RangoFechasComponent:init');
        this.finMaxDate = '+0d';
        this.inicioMaxDate = '+0d';
        this.rango = new Rango();
        this.initForm();
    }

    initForm(): void {
        console.log('RangoFechasComponent:initForm', this.rangoForm.root.status);
        this.rangoForm.root.valueChanges.subscribe(value => {
            this.procesaValue(value);
        });
        // if (this.rangoForm.contains('finicio')) { this.rangoForm.removeControl('finicio'); }
        // if (this.rangoForm.contains('ffin')) { this.rangoForm.removeControl('ffin'); }
        // this.rangoForm.addControl('finicio', this.initFechaControl());
        // this.rangoForm.addControl('ffin', this.initFechaControl());
        // this.rangoForm.valueChanges.subscribe(value => {
        //     this.procesaValue(value);
        // });
        this.rangoForm.get('finicio').valueChanges.subscribe(value => {
            console.log('finicio', value);
        });
        this.rangoForm.get('ffin').valueChanges.subscribe(value => {
            console.log('ffin', value);
        });
    }

    procesaValue(value: any): void {
        console.log('RangoFechasComponent:rangoForm.value', JSON.stringify(value));
        if (value['finicio'] !== null) {
            this.rango.incio = this.strToDate(value['finicio']);
            this.finMinDate = this.calculaStringDif(this.rango.incio);
        }
        if (value['ffin'] !== null) {
            this.rango.fin = this.strToDate(value['ffin']);
            this.inicioMaxDate = this.calculaStringDif(this.rango.fin);
        }
        if (value['ffin'] !== null && value['finicio'] !== null) {
            if (this.rango.fin !== null && this.rango.incio !== null) {
                if (this.rango.fin.getTime() >= this.rango.incio.getTime()) {
                    this.setRango.emit(this.rango);
                }
            }
        }
    }

    private initFechaControl(): FormControl {
        return this._builder.control(null);
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
}
