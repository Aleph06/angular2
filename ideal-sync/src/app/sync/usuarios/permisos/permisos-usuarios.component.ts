import { Component, OnInit, Input } from '@angular/core';
import { Usuario } from '../../shared';
import { Entronque } from '../../entronques/shared';
import { PermisosUsuarioService } from '../../shared';
import { CargandoService, ConfirmacionService, MensajesService } from 'app/shared';

@Component({
    selector: 'i-sync-permisos-usuarios',
    templateUrl: 'permisos-usuarios.component.html'
})
export class PermisosUsuariosComponent implements OnInit {

    usuarioSeleccionado: Usuario;
    entronque: Entronque;
    entronqueSeleccionado: Entronque;
    selectorEntronqueOn = true;
    cols = [
        { field: 'autopista', subField: 'Nombre', header: 'Autopista/Grupo' },
        { field: 'IdEntronque', header: 'Identificador' },
        { field: 'Descripcion', header: 'Nombre' }
    ];

    constructor(
        private _cargandoService: CargandoService,
        private dialogoConfirmacionService: ConfirmacionService,
        private _mensajesSrv: MensajesService,
        private _permisosUsuarioService: PermisosUsuarioService) { }

    ngOnInit() {
        if (this.entronque != null) {
            this.selectorEntronqueOn = false;
        }
    }

    setUsuario(usuario: Usuario) {
        console.log('set', usuario);
        this.usuarioSeleccionado = usuario;
    }

    setEntronque(entronque: Entronque) {
        this.entronque = entronque;
    }

    actualizaEntronques() {
        console.log('validar si es necesario actualizar');
    }

    eliminarPermiso() {
        this.dialogoConfirmacionService.confirmar({
            encabezado: 'Confirmación',
            mensaje: `Se removerá el permiso, del usuario: ${this.usuarioSeleccionado.usuario},
            al entronque: ${this.entronqueSeleccionado.Descripcion}.
            ¿Desea continuar?`, tipo: 'warn'
        })
            .subscribe(respuesta => {
                if (respuesta) {
                    this._permisosUsuarioService.delete(this.usuarioSeleccionado.Id, this.entronqueSeleccionado.Id)
                        .then(r => {
                            if (r.ok) {
                                const ind = this.usuarioSeleccionado.entronques.indexOf(this.entronqueSeleccionado);
                                this.usuarioSeleccionado.entronques.splice(ind, 1);
                                this._mensajesSrv.agregaInfo('Permiso removido');
                            } else {
                                throw Error('Error al eliminar permiso');
                            }
                        })
                        .catch(error => {
                            this._mensajesSrv.agregaError(error);
                        });
                } else {
                    this.entronqueSeleccionado = null;
                }
            });
    }

    agregarPermiso() {
        const permiso = this.usuarioSeleccionado.entronques.find(e => e.Id === this.entronque.Id);
        if (permiso === undefined) {
            this.dialogoConfirmacionService.confirmar({
                encabezado: 'Confirmación',
                mensaje: `Se otorgará permiso, al usuario: ${this.usuarioSeleccionado.usuario},
            en el  entronque: ${this.entronque.Descripcion}.
            ¿Desea continuar?`, tipo: 'info'
            })
                .subscribe(respuesta => {
                    if (respuesta) {
                        this._permisosUsuarioService.add(this.usuarioSeleccionado.Id, this.entronque.Id)
                            .then(r => {
                                if (r.ok) {
                                    this.usuarioSeleccionado.entronques.push(this.entronque);
                                    this._mensajesSrv.agregaInfo('Permiso otorgado');
                                } else {
                                    throw Error('Error al eliminar permiso');
                                }
                            })
                            .catch(error => {
                                this._mensajesSrv.agregaError(error);
                            });
                    }
                });
        } else {
            this._mensajesSrv.agregaInfo('El usuario ya cuenta con el permiso');
        }
    }

}
