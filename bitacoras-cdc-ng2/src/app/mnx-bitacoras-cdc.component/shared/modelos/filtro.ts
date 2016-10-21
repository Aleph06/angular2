import { Paginador } from './paginador';
import { Orden } from './orden';
export class Filtro {
    constructor(
        public fechaInicial?: Date,
        public fechaFinal?: Date,
        public operacion?: string,
        public usuario?: string,
        public columnasConCambio = Array<string>(),
        public paginador?: Paginador,
        public orden?: Orden,
    ) { }
}