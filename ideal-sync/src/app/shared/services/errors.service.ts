import { Injectable } from '@angular/core';

@Injectable()
export class HttpErrorsService {

    private errorMap: { [key: string]: { [key: number]: string } } = {
        'login': {
            404: 'Usuario y/o Contraseña incorrectos',
            401: 'Usuario y/o Contraseña incorrectos',
            400: 'Usuario y/o Contraseña incorrectos',
        },
        'default': {
            500: 'Servicio no disponible, favor de intentar mas tarde',
            0: 'Http error'
        }
    };

    constructor() { }


    getError(serviceName: string, errorCode: number): string {
        if (this.errorMap[serviceName]) {
            if (this.errorMap[serviceName][errorCode]) {
                return this.errorMap[serviceName][errorCode];
            } else {
                return this.errorMap['default'][500];
            }
        }
        return this.errorMap['default'][0];
    }

}
