import { Injectable } from "@angular/core";
import { serverTimestamp } from "firebase/firestore";

import { Datos, FirestoreCrud } from "./firestore-crud";
import { Producto } from "../models/modelos";
import { COLECCION_PRODUCTOS } from "../utils/constantes";

@Injectable({ providedIn: "root" })
export class ProductoService extends FirestoreCrud<Producto> {

    protected readonly coleccion = COLECCION_PRODUCTOS;

    protected preparar(datos: Datos): Datos {
        return {
            nombre: String(datos["nombre"]).trim(),
            categoria: String(datos["categoria"]).trim(),
            precio: Number(datos["precio"]),
            imagenPrincipal: String(datos["imagenPrincipal"]).trim(),
            stock: Number(datos["stock"]),
            activo: Boolean(datos["activo"])
        };
    }

    protected override alCrear(datos: Datos): Datos {
        return { ...datos, fechaCreacion: serverTimestamp() };
    }
}
