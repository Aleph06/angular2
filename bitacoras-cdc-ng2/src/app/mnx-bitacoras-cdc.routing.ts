import { Routes, RouterModule } from '@angular/router';
import { MnxBitacorasCDCComponent } from './mnx-bitacoras-cdc/mnx-bitacoras-cdc.component';
import { SelectorBitacoraComponent, ConsultaBitacoraComponent } from './mnx-bitacoras-cdc/shared'
import { PageNotFoundComponent, NotAuthorizedComponent, InternalErrorComponent } from './error';
import { AuthGuard, AuthService, authHeader } from './shared';

const appRoutes: Routes = [
    { path: '', redirectTo: 'consulta', pathMatch: 'full' },
    { path: 'consulta', component: MnxBitacorasCDCComponent, canActivate: [AuthGuard] },
    { path: 'selector', component: SelectorBitacoraComponent, canActivate: [AuthGuard] },
    { path: 'consulta/:idTabOrigen', component: ConsultaBitacoraComponent, canActivate: [AuthGuard] },
    { path: 'noautorizado', component: NotAuthorizedComponent },
    { path: 'errorinterno', component: InternalErrorComponent },
    { path: '**', component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [
    { provide: 'authHeader', useValue: authHeader }, AuthGuard, AuthService
];

export const routing = RouterModule.forRoot(appRoutes);
