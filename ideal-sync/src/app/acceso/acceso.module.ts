import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoginRoutingModule } from './acceso.routing';
import { LoginComponent } from './login/login.component';
import { RecuperaPwdComponent } from './recupera-pwd/recupera-pwd.component';
import { MaterialSyncModule, SharedModule } from 'app/shared';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialSyncModule,
    SharedModule,
    LoginRoutingModule
  ],
  declarations: [LoginComponent, RecuperaPwdComponent]
})
export class AccesoModule { }
