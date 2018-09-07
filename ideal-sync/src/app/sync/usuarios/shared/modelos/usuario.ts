import { Entronque } from '../../../entronques/index';
export class Usuario {
    constructor(
        public Id: number,
        public usuario: string,
        // public activo = true,
        // public contrasenia?: string,
        // public rol?: string,
        // public decripcion?: string
        public entronques: Entronque[]
    ) { }
}
