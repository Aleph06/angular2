import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// Statics
import 'rxjs/add/observable/throw';
// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import { UsuariosService } from '../../servicios/usuarios.service';
import { Usuario } from '../../modelos/usuario';
@Component({
  selector: 'buscador-usuarios',
  templateUrl: 'buscador-usuarios.component.html'
})
export class BusquedaUsuariosComponent {

  constructor(private _builder: FormBuilder,
    private _usuariosService: UsuariosService) {
    this.buscadorForm = this._builder.group({
      nombreUsuario: [null, Validators.required]
    });
  }

  private searchTermStream = new Subject<string>();
  buscadorForm: FormGroup;
  items: Observable<Usuario[]> = this.searchTermStream
    .debounceTime(300)
    .distinctUntilChanged()
    .switchMap<Usuario[]>((term: string) => {
      return this._usuariosService.buscarUsuario(term)
        .finally(() => {
          this.buscando = false;
        });
    });
  @Output() onSelect = new EventEmitter<Usuario>();
  buscando = false;


  search(event: any): void {
    this.buscando = true;
    this.searchTermStream.next(String(event.query).toUpperCase());
  }

  seleccionarUsuario(usuario: Usuario): void {
    if (!usuario.entronques || usuario.entronques === null || usuario.entronques === undefined) {
      usuario.entronques = new Array();
    }
    this.onSelect.emit(usuario);
  }

}

