import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgIdleModule } from '@ng-idle/core';
import { DeviceDetectorModule } from 'ngx-device-detector';
import localeEs from '@angular/common/locales/es';
import localeEsExtra from '@angular/common/locales/extra/es-MX';
registerLocaleData(localeEs, 'es');
registerLocaleData(localeEs, 'es-MX', localeEsExtra);
import { environment } from 'environments/environment';

import { ErrorPagesModule } from './error-pages';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialSyncModule, SharedRootModule } from './shared';
import { AccesoModule } from './acceso';
import { SyncModule } from './sync/sync.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    FlexLayoutModule,
    NgIdleModule.forRoot(),
    DeviceDetectorModule.forRoot(),
    AppRoutingModule,
    MaterialSyncModule,
    SharedRootModule,
    AccesoModule,
    SyncModule,
    ErrorPagesModule
  ],
  providers: [
    { provide: 'AUTH_API_ENDPOINT', useValue: environment.authApiURL },
    { provide: 'IDLE_TIMEOUT', useValue: environment.timeOut },
    { provide: LOCALE_ID, useValue: 'es-MX' },
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
