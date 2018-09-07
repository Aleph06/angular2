import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule, MaterialSyncModule } from 'app/shared';
import { SyncRoutingModule } from './sync-routing.module';
import { SyncComponent } from './sync.component';
import { SyncSharedModule } from './shared/sync-shared.module';

import {
  Reporte0Component, Reporte1Component, Reporte2Component,
  Reporte3Component, Reporte4Component, Reporte5Component,
  UtilsService
} from './reportes';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    SharedModule, MaterialSyncModule,
    SyncRoutingModule, SyncSharedModule
  ],
  declarations: [SyncComponent, Reporte0Component, Reporte1Component, Reporte2Component,
    Reporte3Component, Reporte4Component, Reporte5Component],
  providers: [UtilsService]
})
export class SyncModule { }
