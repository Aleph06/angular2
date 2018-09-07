export class Conexion {
    constructor(
        public Id: number,
        public DireccionIP: string,
        public Usuario: string,
        public Contrasena: string,
        public URL?: string,
        public IdEntronque?: number,
        public Estatus?: boolean
    ) { }
}
