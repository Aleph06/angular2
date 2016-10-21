import { Routes, RouterModule } from '@angular/router';
import { MnxBitacorasCDCComponent } from './mnx-bitacoras-cdc.component/mnx-bitacoras-cdc.component';
import { PageNotFoundComponent, NotAuthorizedComponent, InternalErrorComponent } from './error';
import { AuthGuard, AuthService, authHeader } from './shared';

const appRoutes: Routes = [
    { path: '', component: MnxBitacorasCDCComponent, canActivate: [AuthGuard] },
    { path: 'noautorizado', component: NotAuthorizedComponent },
    { path: 'errorinterno', component: InternalErrorComponent },
    { path: '**', component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [
    { provide: 'authHeader', useValue: authHeader }, AuthGuard, AuthService
];

export const routing = RouterModule.forRoot(appRoutes);
