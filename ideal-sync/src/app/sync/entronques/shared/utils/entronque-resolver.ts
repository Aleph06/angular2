import { Injectable } from '@angular/core';
import {
    Router, Resolve,
    ActivatedRouteSnapshot
} from '@angular/router';
import { EntronquesService } from '../servicios/entronques.service';
import { Entronque } from '../modelos/entronque';
@Injectable()
export class EntronqueResolve implements Resolve<Entronque> {
    constructor(private _entronquesSrv: EntronquesService, private router: Router) { }
    resolve(route: ActivatedRouteSnapshot): Promise<Entronque> | boolean {
        let idAutopista: number = +route.params['idAutopista'];
        let id: number = +route.params['id'];
        if (isNaN(id) || isNaN(id)) {
            return null;
        }
        return this._entronquesSrv.getEntronqueByidAutopistaId(idAutopista, id).then(entronque => {
            if (entronque) {
                return entronque;
            } else { // id not found
                this.router.navigate(['/entronques']);
                return false;
            }
        });
    }
}