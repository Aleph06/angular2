export class Paginador {
    constructor(
        public inicio?: number,
        public regPorPagina?: number) { }

    equals(other: Paginador) {
        if (((other.inicio !== null || this.inicio !== null) && other.inicio !== this.inicio)) {
            console.log('inicio    ', `${other.inicio}!=${this.inicio}`);
            return false;
        }
        if (((other.regPorPagina !== null || this.regPorPagina !== null) && other.regPorPagina !== this.regPorPagina)) {
            console.log('regPorPagina    ', `${other.regPorPagina}!=${this.regPorPagina}`);
            return false;
        }
        return true;
    }
}
