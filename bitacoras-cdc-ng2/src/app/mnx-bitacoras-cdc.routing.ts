import { Routes, RouterModule } from '@angular/router';
import { MnxBitacorasCDCComponent } from './mnx-bitacoras-cdc.component/mnx-bitacoras-cdc.component';
import { PageNotFoundComponent, NotAuthorizedComponent, InternalErrorComponent } from './error';

const appRoutes: Routes = [
    { path: '', component: MnxBitacorasCDCComponent },
    { path: 'noautorizado', component: NotAuthorizedComponent },
    { path: 'errorinterno', component: InternalErrorComponent },
    { path: '**', component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [

];

export const routing = RouterModule.forRoot(appRoutes);
