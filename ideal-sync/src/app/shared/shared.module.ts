import { NgModule, ModuleWithProviders } from '@angular/core';
import { CookieModule } from 'ngx-cookie';
import { StoreManagement, LoginService, HeaderInterceptor } from './services';
import { SafeHtmlPipe, TruncatePipe, NullPipe, FormErrorsPipe, ChildArrayLengthPipe, SafeStylePipe } from './pipes';
import {
    MensajesComponent, DialogoCargaComponent, DialogoConfirmacionComponent, FadeInOutComponent,
    CargandoService, ConfirmacionService, MensajesService, Slider2Component, Slider3Component
} from './components';
import { MaterialSyncModule } from './material-sync.module';
import { SessionModule, SecurityModule } from './submodules';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [MensajesComponent, DialogoCargaComponent, DialogoConfirmacionComponent, FadeInOutComponent,
        NullPipe, TruncatePipe, SafeHtmlPipe, SafeStylePipe, FormErrorsPipe, Slider2Component, Slider3Component, ChildArrayLengthPipe],
    imports: [CommonModule, FlexLayoutModule, FormsModule, ReactiveFormsModule, CookieModule.forRoot(),
        SessionModule.forRoot(), SecurityModule, MaterialSyncModule],
    exports: [MensajesComponent, DialogoCargaComponent, DialogoConfirmacionComponent, FadeInOutComponent,
        NullPipe, TruncatePipe, SafeHtmlPipe, SafeStylePipe, FormErrorsPipe, Slider2Component, Slider3Component, ChildArrayLengthPipe],
    entryComponents: [DialogoCargaComponent, DialogoConfirmacionComponent, MensajesComponent]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [StoreManagement, CargandoService, ConfirmacionService, MensajesService, LoginService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: HeaderInterceptor,
                    multi: true
                }]
        };
    }
}

@NgModule({
    exports: [SharedModule],
    providers: [StoreManagement, CargandoService, ConfirmacionService, MensajesService, LoginService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HeaderInterceptor,
            multi: true
        }]
})
export class SharedRootModule { }
