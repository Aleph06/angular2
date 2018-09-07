import { Component, OnInit, Input } from '@angular/core';
import { Title }     from '@angular/platform-browser';
import { Usuario } from '../shared';
import { Entronque } from '../../entronques/shared';
import { PermisosUsuarioService } from '../../shared';
import { CargandoService, DialogoConfirmacionService, MensajesService } from '../../../shared';

@Component({
    selector: 'permisos-usuarios',
    templateUrl: 'permisos-usuarios.component.html'
})
export class PermisosUsuariosComponent implements OnInit {

    usuarioSeleccionado: Usuario;
    private entronque: Entronque;
    entronqueSeleccionado: Entronque;
    selectorEntronqueOn = true;

    constructor(private titleService: Title,
        private _cargandoService: CargandoService,
        private dialogoConfirmacionService: DialogoConfirmacionService,
        private _mensajesSrv: MensajesService,
        private _permisosUsuarioService: PermisosUsuarioService) { }

    ngOnInit() {
        this.titleService.setTitle('Ideal Sync - Permisos usuarios');
        if (this.entronque != null) {
            this.selectorEntronqueOn = false;
        }
    }

    setUsuario(usuario: Usuario) {
        this.usuarioSeleccionado = usuario;
    }

    setEntronque(entronque: Entronque) {
        this.entronque = entronque;
    }

    actualizaEntronques() {
        console.log('validar si es necesario actualizar');
    }

    eliminarPermiso() {
        this.dialogoConfirmacionService.confirmarBasic('Confirmación',
            `Se removerá el permiso, del usuario: ${this.usuarioSeleccionado.usuario},
            al entronque: ${this.entronqueSeleccionado.Descripcion}.
            ¿Desea continuar?`)
            .then(respuesta => {
                if (respuesta) {
                    this._cargandoService.toggleLoadingIndicator(true);
                    this._permisosUsuarioService.delete(this.usuarioSeleccionado.Id, this.entronqueSeleccionado.Id)
                        .then(r => {
                            if (r.ok) {
                                let ind = this.usuarioSeleccionado.entronques.indexOf(this.entronqueSeleccionado);
                                this.usuarioSeleccionado.entronques.splice(ind, 1);
                                this._mensajesSrv.agregaMensaje('info', 'Éxito', 'Permiso removido');
                                this._cargandoService.toggleLoadingIndicator(false);
                            } else {
                                throw Error('Error al eliminar permiso');
                            }
                        })
                        .catch(error => {
                            this._mensajesSrv.agregaError(error);
                            this._cargandoService.toggleLoadingIndicator(false);
                        });
                } else {
                    this.entronqueSeleccionado = null;
                }
            });
    }

    agregarPermiso() {
        let permiso = this.usuarioSeleccionado.entronques.find(e => e.Id === this.entronque.Id);
        if (permiso === undefined) {
            this.dialogoConfirmacionService.confirmarBasic('Confirmación',
                `Se otorgará permiso, al usuario: ${this.usuarioSeleccionado.usuario},
            en el  entronque: ${this.entronque.Descripcion}.
            ¿Desea continuar?`)
                .then(respuesta => {
                    if (respuesta) {
                        this._cargandoService.toggleLoadingIndicator(true);
                        this._permisosUsuarioService.add(this.usuarioSeleccionado.Id, this.entronque.Id)
                            .then(r => {
                                if (r.ok) {
                                    this.usuarioSeleccionado.entronques.push(this.entronque);
                                    this._mensajesSrv.agregaMensaje('info', 'Éxito', 'Permiso otorgado');
                                    this._cargandoService.toggleLoadingIndicator(false);
                                } else {
                                    throw Error('Error al eliminar permiso');
                                }
                            })
                            .catch(error => {
                                this._mensajesSrv.agregaError(error);
                                this._cargandoService.toggleLoadingIndicator(false);
                            });
                    }
                });
        } else {
            this._mensajesSrv.agregaMensaje('info', 'Invalido', 'El usuario ya cuenta con el permiso');
        }
    }

}
