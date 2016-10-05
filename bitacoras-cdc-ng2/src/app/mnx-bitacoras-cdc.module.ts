import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { ANGULAR2_COOKIE_PROVIDERS } from 'angular2-cookie/core';
import { BitCdcMetadataPipe, BitCdcLlavePipe, BitCdcConstantes } from './shared';

import { InternalErrorComponent, PageNotFoundComponent, NotAuthorizedComponent, ErrorPageComponent } from './error';
import { MnxBitacorasCDCComponent } from './mnx-bitacoras-cdc.component/mnx-bitacoras-cdc.component';
import { MnxBitacorasCDCAppComponent } from '././mnx-bitacoras-cdc.app.component';
import { routing } from './mnx-bitacoras-cdc.routing';

@NgModule({
  declarations: [
    MnxBitacorasCDCAppComponent,
    MnxBitacorasCDCComponent,
    InternalErrorComponent, PageNotFoundComponent, NotAuthorizedComponent, ErrorPageComponent,
    BitCdcMetadataPipe, BitCdcLlavePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    routing
  ],
  providers: [Title, ANGULAR2_COOKIE_PROVIDERS, { provide: 'apiUrl', useValue: BitCdcConstantes.api }],
  bootstrap: [MnxBitacorasCDCAppComponent]
})
export class MnxBitacorasCDCModule { }
