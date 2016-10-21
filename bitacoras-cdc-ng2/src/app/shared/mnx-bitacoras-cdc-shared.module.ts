import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndicadorCargaDialogoComponent, IndicadorCargaInlineComponent, CargandoService } from './componentes/indicador-carga';
import { DialogoConfirmacionComponent, DialogoConfirmacionService } from './componentes/dialogo-confirmacion';
import { MensajesComponent, MensajesService } from './componentes/mensajes';
import { RangoFechasComponent } from './componentes/rango-fechas';
import { BitCdcLlavePipe, BitCdcMetadataPipe } from './pipes/index';
import { AuthService, AuthGuard } from './servicios/index';

import { CommonModule } from '@angular/common';
import { DialogModule, MessagesModule, CalendarModule, GrowlModule } from 'primeng/primeng';

@NgModule({
    imports: [CommonModule, DialogModule, MessagesModule, CalendarModule, GrowlModule,
        FormsModule, ReactiveFormsModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [IndicadorCargaDialogoComponent, IndicadorCargaInlineComponent, RangoFechasComponent,
        DialogoConfirmacionComponent, MensajesComponent, BitCdcLlavePipe, BitCdcMetadataPipe],
    exports: [IndicadorCargaDialogoComponent, IndicadorCargaInlineComponent, CommonModule,
        DialogModule, MessagesModule, CalendarModule, GrowlModule, RangoFechasComponent,
        FormsModule, ReactiveFormsModule,
        DialogoConfirmacionComponent, MensajesComponent, BitCdcLlavePipe, BitCdcMetadataPipe]
})
export class SharedModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [AuthGuard, AuthService, CargandoService,
                DialogoConfirmacionService, MensajesService]
        };
    }
}

@NgModule({
    exports: [SharedModule],
    providers: [AuthGuard, AuthService, CargandoService, DialogoConfirmacionService, MensajesService]
})
export class SharedRootModule { }