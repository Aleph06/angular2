import { Paginador } from './paginador';
import { Orden } from './orden';
export class Filtro {
    constructor(
        public fechaInicial?: Date,
        public fechaFinal?: Date,
        public operacion?: string,
        public usuario?: string,
        public columnasConCambio = Array<string>(),
        public llaves?: { [key: string]: string },
        public paginador?: Paginador,
        public orden?: Orden,
    ) { }

    equals(other: Filtro): boolean {
        if (other === null || (typeof other === 'undefined')) {
            console.log('filtroN    ', JSON.stringify(other));
            return false;
        }
        if (((other.operacion !== null || this.operacion !== null) && other.operacion !== this.operacion)) {
            console.log('operacion    ', `${other.operacion}!=${this.operacion}`);
            return false;
        }
        if (((typeof other.fechaInicial) !== (typeof this.fechaInicial))
            || ((typeof other.fechaInicial) === (typeof this.fechaInicial)
                && ((typeof this.fechaInicial) !== 'undefined')
                && other.fechaInicial.getTime() !== this.fechaInicial.getTime())) {
            console.log('fechaInicial    ', `${other.fechaInicial}!=${this.fechaInicial}`);
            return false;
        }
        if (((typeof other.fechaFinal) !== (typeof this.fechaFinal))
            || ((typeof other.fechaFinal) === (typeof this.fechaFinal)
                && ((typeof this.fechaFinal) !== 'undefined')
                && other.fechaFinal.getTime() !== this.fechaFinal.getTime())) {
            console.log('fechaFinal    ', `${other.fechaFinal}!=${this.fechaFinal}`);
            return false;
        }
        if ((other.columnasConCambio !== null || this.columnasConCambio !== null) && other.columnasConCambio.length !== this.columnasConCambio.length) {
            console.log('usuario    ', `${other.usuario}!=${this.usuario}`);
            return false;
        }
        if ((other.usuario !== null || this.usuario !== null) && other.usuario !== this.usuario) {
            console.log('usuario    ', `${other.usuario}!=${this.usuario}`);
            return false;
        }
        if ((other.llaves !== null || this.llaves !== null) && !this.compareKeys(other.llaves)) {
            console.log('llaves    ', `${JSON.stringify(other.llaves)}!=${JSON.stringify(this.llaves)}`);
            return false;
        }
        if ((other.orden !== null || this.orden !== null) && !other.orden.equals(this.orden)) {
            console.log('orden    ', `${other.orden}!=${this.orden}`);
            return false;
        }
        if ((other.paginador !== null || this.paginador !== null) && !other.paginador.equals(this.paginador)) {
            console.log('paginador    ', `${other.paginador}!=${this.paginador}`);
            return false;
        }
        return true;
    }

    compareKeys(otrallave: { [key: string]: string }): boolean {
        for (let key in otrallave) {
            if (otrallave.hasOwnProperty(key)) {
                if (typeof this.llaves[key] === 'undefined' || String(otrallave[key]) !== String(this.llaves[key])) {
                    // console.log('otrallave    ', `${JSON.stringify(otrallave)}!=${JSON.stringify(this.llaves)}`);
                    return false;
                }
            }
        }
        for (let key in this.llaves) {
            if (this.llaves.hasOwnProperty(key)) {
                if (typeof otrallave[key] === 'undefined' || String(otrallave[key]) !== String(this.llaves[key])) {
                    // console.log('this.llaves    ', `${JSON.stringify(otrallave)}!=${JSON.stringify(this.llaves)}`);
                    return false;
                }
            }
        }
        return true;
    }
}
