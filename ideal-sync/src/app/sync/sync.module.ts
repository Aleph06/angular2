import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FileUploadModule } from 'ng2-file-upload';

import {
  ButtonModule, InputTextModule, BreadcrumbModule, PanelMenuModule, InputTextareaModule,
  DataTableModule, CalendarModule, ToolbarModule, PanelModule, TabViewModule, DropdownModule,
  ListboxModule, CheckboxModule, FieldsetModule, DataScrollerModule, AutoCompleteModule, AccordionModule, DataGridModule, DialogModule
} from 'primeng/primeng';

import { TableModule } from 'primeng/table';

import { SharedModule, MaterialSyncModule } from 'app/shared';
import { SyncRoutingModule } from './sync-routing.module';
import { SyncComponent } from './sync.component';
import { SyncSharedModule } from './shared/sync-shared.module';

import { PermisosUsuariosComponent } from './usuarios';
import {
  EntronqueAdminOperaComponent, CargasComponent, CargasService,
  SelectorEntronqueComponent, BasesService, AutopistasService, EnlacesService, EntronquesService,
  EntronqueResolve, MetadatosService, ProcesosService, EntronqueDetalleComponent, AgregarComponent, EditarComponent,
  BaseComponent, DatosComponent, PermisosEntronqueComponent
} from './entronques';

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
    FlexLayoutModule, FileUploadModule, TableModule,
    ButtonModule, InputTextModule, BreadcrumbModule, PanelMenuModule, InputTextareaModule, DialogModule,
    DataTableModule, CalendarModule, ToolbarModule, PanelModule, TabViewModule, DropdownModule,
    ListboxModule, CheckboxModule, FieldsetModule, DataScrollerModule, AutoCompleteModule, AccordionModule, DataGridModule,
    SharedModule, MaterialSyncModule,
    SyncRoutingModule, SyncSharedModule.forRoot()
  ],
  declarations: [SyncComponent, Reporte0Component, Reporte1Component, Reporte2Component,
    Reporte3Component, Reporte4Component, Reporte5Component, PermisosUsuariosComponent, EntronqueAdminOperaComponent,
    EntronqueDetalleComponent, AgregarComponent, EditarComponent, BaseComponent, DatosComponent, PermisosEntronqueComponent,
    CargasComponent, SelectorEntronqueComponent],
  providers: [UtilsService, CargasService, BasesService, AutopistasService, EnlacesService, EntronquesService, EntronqueResolve,
    MetadatosService, ProcesosService]
})
export class SyncModule { }
