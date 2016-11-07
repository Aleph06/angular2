import { Component, OnInit, ViewContainerRef, trigger, state, style, transition, animate } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
@Component({
  selector: 'mnx-bitacoras-cdc-test-grid',
  templateUrl: './test-grid.component.html',
  providers: [MdSnackBar],
  animations: [
    trigger('estado', [
      state('inactivo', style({
        transform: 'scale(1)'
      })),
      state('activo', style({
        transform: 'scale(1.3)'
      })),
      transition('inactivo => activo', animate('500ms ease-in')),
      transition('activo => inactivo', animate('500ms ease-out'))
    ])
  ]
})
export class TestGridComponent implements OnInit {

  estatus: boolean;
  formTest: FormGroup;

  constructor(private snackBar: MdSnackBar,
    private viewContainerRef: ViewContainerRef,
    private _builder: FormBuilder) { }

  ngOnInit() {
    this.estatus = false;
    this.formTest = this._builder.group({
      uno: [null, [Validators.required]],
      dos: [null, [Validators.required, Validators.maxLength(10)]],
      tres: [null, [Validators.required, Validators.minLength(5)]]
    });
    this.formTest.statusChanges.subscribe(estatus => {
      console.log('Estatus form', estatus);
      if (estatus === 'INVALID') {
        Object.keys(this.formTest.controls).map(prop => this.formTest.controls[prop]).forEach(control => {
          console.log('errors', JSON.stringify(control.errors));
        });
      }
    });
  }

  toogleEstado() {
    this.estatus = !this.estatus;
  }

}
