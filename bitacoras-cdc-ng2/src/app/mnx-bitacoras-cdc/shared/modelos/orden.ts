export class Orden {
    constructor(
        public orden?: string,
        public columnaOrden?: string) { }

    equals(other: Orden) {
        if ((other.orden !== null || this.orden !== null) && other.orden !== this.orden) {
            console.log('orden    ', `${other.orden}!=${this.orden}`);
            return false;
        }
        if ((other.columnaOrden !== null || this.columnaOrden !== null) && other.columnaOrden !== this.columnaOrden) {
            console.log('columnaOrden    ', `${other.columnaOrden}!=${this.columnaOrden}`);
            return false;
        }
        return true;
    }
}
