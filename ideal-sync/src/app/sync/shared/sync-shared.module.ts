import { RouterModule } from '@angular/router';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule, MaterialSyncModule } from '../../shared';
import { VacioComponent, AutorizarModalComponent, UsuariosSelectorComponent } from './components';
import { EnableInRoleDirective } from './directives/enable-in-role.directive';
import { AutorizarService, UsuariosService, PermisosUsuarioService } from './services';


@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, FlexLayoutModule, RouterModule,
    SharedModule, MaterialSyncModule
  ],
  declarations: [VacioComponent, AutorizarModalComponent, UsuariosSelectorComponent, EnableInRoleDirective],
  exports: [VacioComponent, EnableInRoleDirective, AutorizarModalComponent, UsuariosSelectorComponent],
  entryComponents: [AutorizarModalComponent]
})
export class SyncSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SyncSharedModule,
      providers: [AutorizarService, UsuariosService, PermisosUsuarioService]
    };
  }

}
