import { RouterModule } from '@angular/router';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule, MaterialSyncModule } from '../../shared';
import { VacioComponent, AutorizarModalComponent } from './components';
import { AutorizarService } from './services';

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, FlexLayoutModule, RouterModule,
    SharedModule, MaterialSyncModule
  ],
  declarations: [VacioComponent, AutorizarModalComponent],
  exports: [VacioComponent],
  entryComponents: [AutorizarModalComponent]
})
export class SyncSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SyncSharedModule,
      providers: [AutorizarService]
    };
  }

}
