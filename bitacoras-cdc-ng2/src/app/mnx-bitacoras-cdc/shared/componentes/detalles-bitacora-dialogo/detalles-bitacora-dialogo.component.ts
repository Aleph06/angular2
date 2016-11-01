import { Component, Input } from '@angular/core';
import { CargandoService, MensajesService } from '../../../../shared';
import { TablaOrigen } from '../../modelos';
import { BitacorasService } from '../../servicios';

@Component({
    selector: 'mnx-bitacoras-cdc-detalles-bitacora',
    template: `<p-dialog [width]="500" [modal]="true"
     style="position: fixed; top: 40%; left:45%; z-index: 19861128;" 
                header="Detalles"
                 [(visible)]="mostrar" responsive="true" >
                <div class="ui-g">
                    <div class="ui-g-12 ui-sm-12 ui-md-12 ui-lg-1 ui-xl-1">
                    </div>
                    <div class="ui-g-12 ui-sm-12 ui-md-12 ui-lg-10 ui-xl-10" >
                        <p-dataTable *ngIf="detalles && detalles.length > 0" scrollable="true" scrollHeight="300px" [value]="detalles"
                         emptyMessage="No se encontraron los detalles">
                            <footer>Total: {{detalles ? detalles.length : 0}}</footer>
                             <p-column field="campo" header="Campo"></p-column>
                             <p-column field="nuevo" header="Nuevo"></p-column>
                             <p-column field="anterior" header="Anterior"></p-column>
                        </p-dataTable>
                        <span *ngIf="detalles && detalles.length === 0" >No se encontraton los detalles</span>
                    </div>
                    <div class="ui-g-12 ui-sm-12 ui-md-12 ui-lg-1 ui-xl-1">
                    </div>
                </div>
            </p-dialog>`
})
export class DetallesBitacoraDialogoComponent {

    mostrar = false;
    @Input()
    tablaOrigen: TablaOrigen;
    detalles: any[];
    idBitacora: number;


    constructor(private _cargandoService: CargandoService,
        private _mensajesSrv: MensajesService,
        private _bitacorasSrv: BitacorasService) { }

    cargaDetalles(idBitacora: number) {
        this.idBitacora = idBitacora;
        this._cargandoService.toggleLoadingIndicator(true);
        this._bitacorasSrv
            .getDetallesBitacora(this.tablaOrigen, idBitacora)
            .then(detalles => {
                console.log('detalles', JSON.stringify(detalles));
                this.detalles = detalles;
                this.mostrar = true;
                this._cargandoService.toggleLoadingIndicator(false);
            }).catch(error => { this.mostrar = false; this.handleError(error); });

    }

    /**
   * Maneja errores
   * 
   * @private
   * @param {*} error el error a manejenar
   * 
   * @memberOf MnxBitacorasCDCComponent
   */
    private handleError(error: any) {
        console.log(error);
        this._mensajesSrv.agregaError(error);
        this._cargandoService.toggleLoadingIndicator(false);
    }

}
