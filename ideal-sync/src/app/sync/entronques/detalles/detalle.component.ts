import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../shared';
import { CargandoService, MensajesService, ConfirmacionService } from 'app/shared';
import {
  AutopistasService, EntronquesService, Entronque, Conexion, Base
} from '../../entronques/shared';
import { AgregarComponent } from './agregar/agregar.component';
import { EditarComponent } from './editar/editar.component';

@Component({
  selector: 'i-sync-entronque-detalle',
  templateUrl: 'detalle.component.html',
  styles: [`
  .mat-tab-label {
    min-width: 100px!important;
  }`]
})
export class EntronqueDetalleComponent implements OnInit {

  private sub: any;
  entronque: Entronque;
  @ViewChild(AgregarComponent)
  private agregarComponent: AgregarComponent;
  @ViewChild(EditarComponent)
  private editarComponent: EditarComponent;

  constructor(private usuariosService: UsuariosService,
    private autopistasService: AutopistasService,
    private entronquesService: EntronquesService,
    private route: ActivatedRoute,
    private router: Router,
    private cargandoService: CargandoService,
    private _mensajesSrv: MensajesService,
    private _dlgConfService: ConfirmacionService) {
  }

  ngOnInit() {
    // this.sub = this.route
    //   .params
    //   .subscribe(params => {
    //     let idAutopista: number = +params['idAutopista'];
    //     let id: number = +params['id'];
    //     if (isNaN(id) || isNaN(id)) {
    //       id = 0;
    //       idAutopista = 0;
    //     }
    //     if (id !== 0) {
    //       this.entronquesService.getEntronqueByidAutopistaId(idAutopista, id)
    //         .then(entronque => this.processEntronque(entronque))
    //         .catch(error => {
    //           this._mensajesSrv.agregaError(error);
    //           this.cargandoService.toggleLoadingIndicator(false);
    //         });
    //     } else {
    //       this.entronque = new Entronque(0, null, false, 0, null);
    //       this.entronque.conexion = new Conexion(-1, null, null, null);
    //       this.entronque.baseOrigen = new Base(0, null, null, null, 0);
    //       this.entronque.baseDestino = new Base(0, null, null, null, 0);
    //     }
    //     this.cargandoService.toggleLoadingIndicator(false);
    //   });
    this.route.data.forEach((data: { entronque: Entronque }) => {
      if (data.entronque === null || (!data.entronque)) {
        this.entronque = new Entronque(0, null, false, 0, null);
        this.entronque.conexion = new Conexion(-1, null, null, null);
        this.entronque.baseOrigen = new Base(0, null, null, null, 0);
        this.entronque.baseDestino = new Base(0, null, null, null, 0);
      } else {
        this.entronque = data.entronque;
      }
    });
  }

  processEntronque(entronque: Entronque) {
    if (entronque.IdbaseDestino <= 0) {
      entronque.baseDestino = new Base(0, null, null, null, 0);
    }
    this.entronque = entronque;
  }

  activar(valor: boolean): void {
    if (valor) {
      this._dlgConfService
        .confirmar({ encabezado: 'Activar entronque', mensaje: 'Se activará el entronque, ¿Desea continuar?', tipo: 'info' })
        .subscribe(confirmado => {
          if (confirmado) {
            this.entronquesService.toogleActivo(this.entronque.Id, true)
              .then(() => console.log('ok'))
              .catch(error => {
                this.entronque.Estatus = !valor;
                this._mensajesSrv.agregaError('No fue posible activar el entronque. Consulta o enlace invalidos');
              });
          } else {
            this.entronque.Estatus = !valor;
          }
        });
    } else {
      this._dlgConfService
        .confirmar({ encabezado: 'Desactivar entronque', mensaje: 'Se desactivará el entronque, ¿Desea continuar?', tipo: 'warn' })
        .subscribe(confirmado => {
          if (confirmado) {
            this.entronquesService.toogleActivo(this.entronque.Id, false)
              .then(() => console.log('ok'))
              .catch(error => {
                this._mensajesSrv.agregaError(error);
              });
          } else {
            this.entronque.Estatus = !valor;
          }
        });
    }
  }

  updateMain(event: any): void {
    const value = Boolean(event['value']);
    const evento = event['event'];
  }

}
