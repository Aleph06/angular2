import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Usuario } from '../../../usuarios/shared/index';
import { Entronque } from '../../shared/index';
import { CargandoService, DialogoConfirmacionService, MensajesService } from '../../../../shared';
import { PermisosUsuarioService } from '../../../shared/index';

@Component({
    selector: 'permisos-entronque',
    templateUrl: 'permisos-entronque.component.html'
})
export class PermisosEntronqueComponent implements OnInit {

    usuarioSeleccionado: Usuario;
    usuario: Usuario;
    @Input('entronque') private entronque: Entronque;
    selectorEntronqueOn = true;

    constructor(private titleService: Title,
        private _cargandoService: CargandoService,
        private dialogoConfirmacionService: DialogoConfirmacionService,
        private _mensajesSrv: MensajesService,
        private _permisosUsuarioService: PermisosUsuarioService) { }

    ngOnInit() {
        this.titleService.setTitle('Ideal Sync - Entronques - Permisos entronque');
        this._cargandoService.toggleLoadingIndicator(true);
        this._permisosUsuarioService.getPermisosUsuarioByidEntronque(this.entronque.Id)
            .then(usuarios => {
                this.entronque.usuarios = usuarios;
                this._cargandoService.toggleLoadingIndicator(false);
            }).catch(error => { console.log(error); this._mensajesSrv.agregaError(error); });
    }

    setUsuario(usuario: Usuario) {
        this.usuario = usuario;
    }

    actualizaUsuarios() {
        console.log('validar si es necesario actualizar');
    }

    eliminarPermiso() {
        this.dialogoConfirmacionService.confirmarBasic('Confirmación',
            `Se removerá el permiso, del usuario: ${this.usuarioSeleccionado.usuario},
            al entronque: ${this.entronque.Descripcion}.
            ¿Desea continuar?`)
            .then(respuesta => {
                if (respuesta) {
                    this._permisosUsuarioService.delete(this.usuarioSeleccionado.Id, this.entronque.Id)
                        .then(r => {
                            if (r.ok) {
                                let ind = this.entronque.usuarios.indexOf(this.usuarioSeleccionado);
                                this.entronque.usuarios.splice(ind, 1);
                                this._mensajesSrv.agregaMensaje('info', 'Éxito', 'Permiso removido');
                                this.usuarioSeleccionado = null;
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
                    this.usuarioSeleccionado = null;
                }
            });
    }

    agregarPermiso() {
        let permiso = this.entronque.usuarios.find(u => u.Id === this.usuario.Id);
        if (permiso === undefined) {
            this.dialogoConfirmacionService.confirmarBasic('Confirmación',
                `Se otorgará permiso, al usuario: ${this.usuario.usuario},
            en el  entronque: ${this.entronque.Descripcion}.
            ¿Desea continuar?`)
                .then(respuesta => {
                    if (respuesta) {
                        this._permisosUsuarioService.add(this.usuario.Id, this.entronque.Id)
                            .then(r => {
                                if (r.ok) {
                                    this.entronque.usuarios.push(this.usuario);
                                    this._mensajesSrv.agregaMensaje('info', 'Éxito', 'Permiso otorgado');
                                    this.usuario = null;
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
