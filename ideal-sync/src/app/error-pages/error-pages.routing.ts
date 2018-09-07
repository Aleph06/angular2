import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InternalErrorComponent, NotAuthorizedComponent, PageNotFoundComponent } from './components';

const routes: Routes = [
  { path: 'noautorizado', component: NotAuthorizedComponent },
  { path: 'errorinterno', component: InternalErrorComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorPagesRoutingModule { }
