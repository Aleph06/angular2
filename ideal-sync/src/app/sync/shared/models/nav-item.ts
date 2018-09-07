export interface NavItem {
    nombre: string;
    descripcion: string;
    ruta?: string;
    icon?: string;
    items?: NavItem[];
}
