import { Component, OnInit, ViewContainerRef, trigger, state, style, transition, animate } from '@angular/core';
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

  constructor(private snackBar: MdSnackBar,
    private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    this.estatus = false;
  }

  toogleEstado() {
    this.estatus = !this.estatus;
  }

}
