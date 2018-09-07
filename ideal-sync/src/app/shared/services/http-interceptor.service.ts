import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { SessionService } from '../submodules/session/services/session.service';
import { tap, catchError } from 'rxjs/operators';
import { CargandoService } from '../components';

/**
 *
 *
 * @export
 * @class HeaderInterceptor
 * @implements {HttpInterceptor}
 */
@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
    constructor(
        private ssnSrv: SessionService,
        private loadSrv: CargandoService) { }

    /**
     * Intercepta xhr request y agrega header comunes para operación general, adicionalmente
     * maneja el uso de dialogos para respuesta a usuarios.
     *
     * @param {HttpRequest<any>} req el request
     * @param {HttpHandler} next el handler para continuar con la petición
     * @returns {Observable<HttpEvent<any>>}  Observable de eventos
     * @memberof HeaderInterceptor
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // cache-control
        req = req.clone({
            setHeaders: {
                'Cache-control': 'no-cache, no-store',
                'Expires': '0',
                'Pragma': 'no-cache',
                'If-Modified-Since': '0'
            }
        });
        if (this.ssnSrv.hasToken) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.ssnSrv.token}`
                }
            });
        }
        if (!req.headers.has('NV-Skip-Load')) {
            this.loadSrv.toggle(true);
        }
        return next.handle(req)
            .pipe(
                tap((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        this.loadSrv.toggle(false);
                    }
                }),
                catchError(error => {
                    this.loadSrv.toggle(false);
                    return throwError(error);
                }
                )
            );
    }
}
