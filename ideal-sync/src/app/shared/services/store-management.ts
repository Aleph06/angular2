import { Injectable, Inject } from '@angular/core';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class StoreManagement {
    private ids = ['token-sync', 'tema-sync'];
    constructor(private _cookieSrv: CookieService) { }

    private saveValue(id: string, value: string): void {
        let saved = false;
        if (typeof (localStorage) !== 'undefined') {
            localStorage.setItem(id, value);
            saved = true;
        }
        if (!saved && (typeof (sessionStorage) !== 'undefined')) {
            sessionStorage.setItem(id, value);
            saved = true;
        }
        if (!saved) {
            let milis: number = new Date().getTime();
            milis = milis + (24 * 60 * 60 * 999);
            const caducidad: Date = new Date(milis);
            this._cookieSrv.put(id, value, { 'expires': caducidad.toString() });
        }
    }

    private removeValue(id: string): void {
        if (typeof (localStorage) !== 'undefined') {
            localStorage.removeItem(id);
        }
        if ((typeof (sessionStorage) !== 'undefined')) {
            sessionStorage.removeItem(id);
        }
        if (this._cookieSrv.get(id)) {
            this._cookieSrv.remove(id);
        }
    }

    private getValue(id: string): string {
        if (id === null || (typeof id === 'undefined') || id.length === 0) {
            return null;
        }
        let value: string;
        if (typeof (localStorage) !== 'undefined') {
            value = localStorage.getItem(id);
        }
        if ((typeof (sessionStorage) !== 'undefined') && (value === null || value === undefined)) {
            value = sessionStorage.getItem(id);
        }
        if (value === undefined || value === null) {
            value = String(this._cookieSrv.get(id));
        }
        return value;
    }

    saveToken(token: string): void {
        this.saveValue(this.ids[0], token);
    }

    removeToken(): void {
        this.removeValue(this.ids[0]);
    }

    getToken(): string {
        return this.getValue(this.ids[0]);
    }

    saveDark(dark: boolean): void {
        this.saveValue(this.ids[1], (dark ? 'dark' : 'light'));
    }

    removeDark(): void {
        this.removeValue(this.ids[1]);
    }

    getDark(): boolean {
        const tema = this.getValue(this.ids[1]);
        return (tema && (tema === 'dark'));
    }
}
