import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { ANGULAR2_COOKIE_PROVIDERS } from 'angular2-cookie/core';

import {
  ButtonModule, DropdownModule, DataTableModule, SharedModule, AutoCompleteModule, InputTextModule
} from 'primeng/primeng';

import { api, CalendarLocales, SharedRootModule } from './shared';


import { InternalErrorComponent, PageNotFoundComponent, NotAuthorizedComponent, ErrorPageComponent } from './error';
import {
  MnxBitacorasCDCComponent, SelectorBitacoraComponent,
  ConsultaBitacoraComponent, DetallesBitacoraDialogoComponent
} from './mnx-bitacoras-cdc';
import { TestGridComponent } from './test-grid/test-grid.component';
import {
  ConjuntosDeCambiosService, TablasBitacoraService,
  TablasOrigenService, BitacorasService
} from './mnx-bitacoras-cdc/shared/servicios';
import { MnxBitacorasCDCAppComponent } from './mnx-bitacoras-cdc.app.component';
import { routing, appRoutingProviders } from './mnx-bitacoras-cdc.routing';

@NgModule({
  declarations: [
    MnxBitacorasCDCAppComponent, SelectorBitacoraComponent, ConsultaBitacoraComponent,
    MnxBitacorasCDCComponent, DetallesBitacoraDialogoComponent, TestGridComponent,
    InternalErrorComponent, PageNotFoundComponent, NotAuthorizedComponent, ErrorPageComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    MaterialModule.forRoot(), routing,
    ButtonModule, DropdownModule, DataTableModule, SharedModule, AutoCompleteModule, InputTextModule,
    SharedRootModule
  ],
  providers: [Title, ANGULAR2_COOKIE_PROVIDERS, { provide: 'apiUrl', useValue: api },
    { provide: 'locale', useValue: CalendarLocales['ES'] }, appRoutingProviders,
    ConjuntosDeCambiosService, TablasBitacoraService, TablasOrigenService, BitacorasService],
  bootstrap: [MnxBitacorasCDCAppComponent]
})
export class MnxBitacorasCDCModule { }
