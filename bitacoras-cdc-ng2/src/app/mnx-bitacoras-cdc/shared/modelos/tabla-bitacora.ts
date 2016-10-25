import { ConjuntoDeCambios } from './conjunto-de-cambios';
import { TablaOrigen } from './tabla-origen';
export class TablaBitacora {
    constructor(
        public idTabOrigen: TablaOrigen,
        public nomTabBitacora: string,
        public idConjCam?: ConjuntoDeCambios
    ) { }
}
