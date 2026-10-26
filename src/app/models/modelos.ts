import { Timestamp } from "firebase/firestore";

export interface Producto {
    id?: string;
    nombre: string;
    categoria: string;
    precio: number;
    imagenPrincipal: string;
    stock: number;
    activo: boolean;
}

export interface Plan {
    id?: string;
    nombre: string;
    precio: number;
    beneficios: string[];
    activo: boolean;
}

export interface Horario {
    id?: string;
    clase: string;
    dias: string[];
    horaInicio: string;
    horaFin: string;
    activo: boolean;
}

export interface ItemCarrito {
    id: string;
    nombre: string;
    precio: number;
    imagen: string;
    stock: number;
    cantidad: number;
}

export interface Pedido {
    id?: string;
    usuarioId: string;
    correo: string;
    nombreCliente: string;
    items: { productoId: string; nombre: string; precio: number; cantidad: number }[];
    total: number;
    estado: "pendiente" | "entregado" | "cancelado";
    fecha?: Timestamp;
}

export interface Usuario {
    id?: string;
    nombre: string;
    correo: string;
    rol?: string;
}

export interface TarjetaInfo {
    titulo: string;
    texto: string;
    imagen?: string;
    textoAlternativo?: string;
}

export interface ServicioCrud<T> {
    listar(): Promise<T[]>;
    listarActivos(): Promise<T[]>;
    crear(datos: object): Promise<string>;
    actualizar(id: string, datos: object): Promise<void>;
    eliminar(id: string): Promise<void>;
}
