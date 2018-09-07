import {Entronque} from './entronque';

export class Autopista {
    constructor(
        public Id: number,
        public Nombre: string,
        public Estatus = true,
        public entronques?: Entronque[]
    ) { }
}
