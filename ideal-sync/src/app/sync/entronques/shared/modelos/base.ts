export class Base {
    constructor(
        public Id: number,
        public BaseDeDatos: string,
        public Tabla?: string,
        public sql?: string,
        public IdEntronque?: number,
        public Estatus?: boolean
    ) { }
}
