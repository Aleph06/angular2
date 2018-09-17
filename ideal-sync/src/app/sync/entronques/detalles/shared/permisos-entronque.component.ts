import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Usuario } from '../../../shared';
import { Entronque } from './../../../entronques/shared';
import { CargandoService, ConfirmacionService, MensajesService } from 'app/shared';
import { PermisosUsuarioService } from '../../../shared/index';

@Component({
    selector: 'i-sync-permisos-entronque',
    templateUrl: 'permisos-entronque.component.html'
})
export class PermisosEntronqueComponent implements OnInit {

    usuarioSeleccionado: Usuario;
    usuario: Usuario;
    @Input('entronque') entronque: Entronque;
    selectorEntronqueOn = true;
    cols = [
        { field: 'Id', header: 'Identificador' },
        { field: 'usuario', header: 'Nombre' }
    ];

    constructor(private titleService: Title,
        private _cargandoService: CargandoService,
        private dialogoConfirmacionService: ConfirmacionService,
        private _mensajesSrv: MensajesService,
        private _permisosUsuarioService: PermisosUsuarioService) { }

    ngOnInit() {
        this.titleService.setTitle('Ideal Sync - Entronques - Permisos entronque');
        this._permisosUsuarioService.getPermisosUsuarioByidEntronque(this.entronque.Id)
            .then(usuarios => {
                this.entronque.usuarios = usuarios;
            }).catch(error => { console.log(error); this._mensajesSrv.agregaError(error); });
    }

    setUsuario(usuario: Usuario) {
        this.usuario = usuario;
    }

    actualizaEntronques() {
        console.log('validar si es necesario actualizar');
    }

    eliminarPermiso() {
        this.dialogoConfirmacionService.confirmar({
            encabezado: 'Confirmación',
            mensaje: `Se removerá el permiso, del usuario: ${this.usuarioSeleccionado.usuario},
            al entronque: ${this.entronque.Descripcion}. ¿Desea continuar?`,
            tipo: 'warn'
        })
            .subscribe(respuesta => {
                if (respuesta) {
                    this._permisosUsuarioService.delete(this.usuarioSeleccionado.Id, this.entronque.Id)
                        .then(r => {
                            if (r.ok) {
                                const ind = this.entronque.usuarios.indexOf(this.usuarioSeleccionado);
                                this.entronque.usuarios.splice(ind, 1);
                                this._mensajesSrv.agregaInfo('Permiso removido');
                                this.usuarioSeleccionado = null;
                            } else {
                                throw Error('Error al eliminar permiso');
                            }
                        })
                        .catch(error => {
                            this._mensajesSrv.agregaError(error);
                        });

                } else {
                    this.usuarioSeleccionado = null;
                }
            });
    }

    agregarPermiso() {
        console.log('aqui>>');
        const permiso = this.entronque.usuarios.find(u => u.Id === this.usuario.Id);
        if (permiso === undefined) {
            this.dialogoConfirmacionService.confirmar({
                encabezado: 'Confirmación',
                mensaje: `Se otorgará permiso, al usuario: ${this.usuario.usuario},
                en el  entronque: ${this.entronque.Descripcion}. ¿Desea continuar?`,
                tipo: 'info'
            })
                .subscribe(respuesta => {
                    if (respuesta) {
                        this._permisosUsuarioService.add(this.usuario.Id, this.entronque.Id)
                            .then(r => {
                                if (r.ok) {
                                    this.entronque.usuarios.push(this.usuario);
                                    this._mensajesSrv.agregaInfo('Permiso otorgado');
                                    this.usuario = null;
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
