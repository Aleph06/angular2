import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { SessionService, CargandoService, MensajesService, ConfirmacionService } from 'app/shared';
import { EntronquesService, Entronque, SelectorEntronqueComponent } from '../shared';
import { CargasService } from './shared';

@Component({
  selector: 'i-sync-cargas',
  templateUrl: 'cargas.component.html'
})
export class CargasComponent implements OnInit {

  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  private sub: any;
  entronqueSeleccionado: Entronque;
  @ViewChild(SelectorEntronqueComponent)
  private selector: SelectorEntronqueComponent;


  constructor(
    @Inject('AUTH_API_ENDPOINT') private hostUrl: string,
    private _sesionInfoSrv: SessionService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _cargandoService: CargandoService,
    private entronquesService: EntronquesService,
    private _cargasService: CargasService,
    private _mensajesSrv: MensajesService,
    private _dialogoConfirmacionService: ConfirmacionService,
    private _title: Title) {
  }

  ngOnInit() {
    const header = `Bearer ${this._sesionInfoSrv.token}`;
    this.uploader = new FileUploader({
      url: `${this.hostUrl}/Upload`,
      authToken: header,
      allowedMimeType: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'],
      removeAfterUpload: true
    });
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this._cargasService.doCarga(this.entronqueSeleccionado.Id, String(response))
        .then(resp => {
          if (resp.ok) {
            console.log(resp.json());
            this._mensajesSrv.agregaMensaje('info', 'Éxito', resp.json());
          } else {
            throw Error(resp.json());
          }
        })
        .catch(error => {
          console.error('Error al cargar datos', error);
          this._mensajesSrv.agregaError(error);
        });
    };
    this.uploader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
      this._mensajesSrv.agregaError(JSON.stringify(response));
    };
    // this.sub = this._route
    //   .params
    //   .subscribe(params => {
    //     let idAutopista: number = +params['idAutopista'];
    //     let id: number = +params['id'];
    //     if (isNaN(id) || isNaN(id)) {
    //       id = 0;
    //       idAutopista = 0;
    //     }
    //     if (id !== 0 && idAutopista !== 0) {
    //       this.entronquesService.getEntronqueByidAutopistaId(idAutopista, id)
    //         .then(entronque => this.setEntronque(entronque))
    //         .catch(error => {
    //           this._mensajesSrv.agregaError(error);
    //           this._cargandoService.toggleLoadingIndicator(false);
    //         });
    //     }
    //     this._cargandoService.toggleLoadingIndicator(false);
    //   });
    this._route.data.forEach((data: { entronque: Entronque }) => {
      this.entronqueSeleccionado = data.entronque;
    });
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  setEntronque(entronque: Entronque) {
    this.entronqueSeleccionado = entronque;
  }

}
