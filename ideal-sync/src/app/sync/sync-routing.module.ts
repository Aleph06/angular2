import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'app/shared';
import { SyncComponent } from './sync.component';
import { VacioComponent } from './shared';

import {
  Reporte0Component, Reporte1Component, Reporte2Component,
  Reporte3Component, Reporte4Component, Reporte5Component
} from './reportes';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: SyncComponent,
    children: [
      { path: '', component: VacioComponent },
      { path: 'reportes/1', component: Reporte0Component },
      { path: 'reportes/2', component: Reporte1Component },
      { path: 'reportes/3', component: Reporte2Component },
      { path: 'reportes/4', component: Reporte3Component },
      { path: 'reportes/5', component: Reporte4Component },
      { path: 'reportes/6', component: Reporte5Component }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SyncRoutingModule { }
