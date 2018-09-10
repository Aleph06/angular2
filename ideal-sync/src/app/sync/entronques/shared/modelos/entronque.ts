import { Conexion } from './conexion';
import { Autopista } from './autopista';
import { Base } from './base';
import { Usuario } from '../../../shared/models/domain/usuario';

export class Entronque {
    constructor(
        public Id: number,
        public Descripcion: string,
        public Estatus = true,
        public IdGrupo: number,
        public IdEntronque: string,
        public IdEnlace?: number,
        public conexion?: Conexion,
        public IdbaseOrigen?: number,
        public baseOrigen?: Base,
        public IdbaseDestino?: number,
        public baseDestino?: Base,
        public usuarios?: Usuario[],
        public autopista?: Autopista,
    ) { }
}
