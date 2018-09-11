import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'app/shared';

@Injectable()
export class UtilsService {

    private utilsUrl = `${this.hostUrl}/utils`;  // URL to web api simuated

    constructor(private http: HttpClient, @Inject('AUTH_API_ENDPOINT') private hostUrl: string, private _authSrv: AuthService) { }

    getUrlSSRS(): Promise<string> {
        const url = `${this.utilsUrl}/remote_ssrs`;
        return this.http.get<string>(url, )
            .toPromise()
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error || JSON.stringify(error));
    }

}
