import { Component, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Mensaje } from '../../models';

@Component({
  selector: 'i-sync-mensajes',
  template: `
    <div fxLayout="row" fxLayoutAlign="spread-around center">
      <div fxFlex="80" [class]="'mensaje '+mensaje?.tipo" fxLayout="row" fxLayoutAlign="start center">
        <i [class]="'fa fa-2x fa-'+ icon"></i>
        <span fxFlex="70" fxFlexOffset="10"> {{mensaje?.mensaje}} </span>
      </div>
      <button fxFlex mat-button (click)="cerrar()">Ok</button>
    </div>
  `,
  styleUrls: ['./mensajes.component.css']
})
export class MensajesComponent implements OnDestroy {

  private cerrarS = new Subject<any>();
  cerrar$ = this.cerrarS.asObservable();
  mensaje: Mensaje;
  // mensaje$ = this.mensajeSubject.asObservable();
  // sub: Subscription;
  // icon: string;

  constructor() {
    // this.sub = this.mensaje$.subscribe(msj => {
    //   this.icon = msj ?
    //     (msj.tipo ?
    //       (msj.tipo === 'info' ?
    //         'question' :
    //         (msj.tipo === 'warn' ?
    //           'warning' :
    //           (msj.tipo === 'error' ?
    //             'times-circle-o' :
    //             'check-circle-o')
    //         )
    //       ) :
    //       'question') :
    //     'question';
    // });
  }

  get icon(): string {
    return this.mensaje ?
      (this.mensaje.tipo ?
        (this.mensaje.tipo === 'info' ?
          'question' :
          (this.mensaje.tipo === 'warn' ?
            'warning' :
            (this.mensaje.tipo === 'error' ?
              'times-circle-o' :
              'check-circle-o')
          )
        ) :
        'question') :
      'question';
  }

  // set mensaje(mensaje: Mensaje) {
  //   this.mensajeSubject.next(mensaje);
  // }

  cerrar(): void {
    this.cerrarS.next('cerrar');
  }

  ngOnDestroy(): void {
    // this.sub.unsubscribe();
  }

}
