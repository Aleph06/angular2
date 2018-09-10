import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { startWith, debounceTime, distinctUntilChanged, map, flatMap, tap } from 'rxjs/operators';
import { Usuario } from '../../models/domain/usuario';
import { UsuariosService } from '../../services';

@Component({
  selector: 'i-sync-usuarios-selector',
  templateUrl: './usuarios-selector.component.html',
  styles: ['']
})
export class UsuariosSelectorComponent implements OnInit {

  autocompleteCtrl: FormControl;
  filteredOptions: Observable<Usuario[]>;
  usuario: Usuario;
  @Output() seleccionado = new EventEmitter<Usuario>();
  showSearchSpinner = 'hidden';
  isEmpty = false;
  @Input()
  minInput = 2;

  constructor(private _usrSrv: UsuariosService) { }

  ngOnInit() {
    this.autocompleteCtrl = new FormControl([''], Validators.minLength(this.minInput));
    this.filteredOptions = this.autocompleteCtrl.valueChanges
      .pipe(
        startWith(undefined),
        debounceTime(500),
        distinctUntilChanged(),
        map(usuario => {
          if (usuario && typeof usuario === 'object') {
            this.setUsuario(<Usuario>usuario);
            console.log('object', usuario);
            this.seleccionado.emit(<Usuario>usuario);
            return usuario.usuario;
          } else {
            return usuario;
          }

        }),
        flatMap(Nombre => {
          return this.filter(Nombre);
        })
      );
  }

  filter(Nombre: string): Promise<Usuario[]> | Observable<Usuario[]> {
    if (typeof Nombre === 'undefined') {
      // console.log('Nombre', null);
      this.seleccionado.emit(<Usuario>null);
    }
    if (Nombre && Nombre.length) {
      if (Nombre.length < this.minInput || (this.usuario && this.usuario != null && Nombre === this.usuario.usuario)) {
        return of(<Usuario[]>[]);
      } else {
        this.showSearchSpinner = 'visible';
        return this._usrSrv.buscar(Nombre)
          .pipe(
            tap(usuarios => {
              this.isEmpty = usuarios.length === 0;
              this.showSearchSpinner = 'hidden';
            })
          );
      }
    } else {
      this.showSearchSpinner = 'visible';
      return this._usrSrv.findAll(10, true)
        .pipe(
          tap(usuarios => {
            this.isEmpty = usuarios.length === 0;
            this.showSearchSpinner = 'hidden';
          })
        );
    }
  }

  displayFn(usuario: Usuario): string {
    return usuario ? usuario.usuario : JSON.stringify(usuario);
  }

  setUsuario(usuario: Usuario): void {
    this.usuario = usuario;
  }

  @Input() set disabled(disabled: boolean) {
    if (this.autocompleteCtrl) {
      if (disabled) {
        this.autocompleteCtrl.disable({ emitEvent: false });
      } else {
        this.autocompleteCtrl.enable();
      }
    }
  }

  get disabled() {
    return this.autocompleteCtrl.disabled;
  }

  cancel() {
    if (!this.disabled || this.autocompleteCtrl.valid) {
      this.autocompleteCtrl.setValue({});
    }
  }

}
