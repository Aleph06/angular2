import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from './services';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: []
})
export class SessionModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SessionModule,
      providers: [SessionService]
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule: SessionModule
    };
  }

}
