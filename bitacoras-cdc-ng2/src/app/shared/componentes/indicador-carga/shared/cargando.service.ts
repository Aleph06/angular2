import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/share';

@Injectable()
export class CargandoService {

  cargando$: Observable<{}>;
  private _observer: Observer<{}>;

  constructor() {
    this.cargando$ = new Observable(
      observer => this._observer = observer).share();
  }

  toggleLoadingIndicator(name) {
    if (this._observer) {
      this._observer.next(name);
    }
  }

}
