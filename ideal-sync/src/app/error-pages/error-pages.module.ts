import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InternalErrorComponent, NotAuthorizedComponent, PageNotFoundComponent } from './components';
import { ErrorPageComponent } from './shared';
import { ErrorPagesRoutingModule } from './error-pages.routing';
import { MaterialSyncModule } from '../shared';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialSyncModule,
    ErrorPagesRoutingModule
  ],
  declarations: [ErrorPageComponent, InternalErrorComponent, NotAuthorizedComponent, PageNotFoundComponent]
})
export class ErrorPagesModule { }
