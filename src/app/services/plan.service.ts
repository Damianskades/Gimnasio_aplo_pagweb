import { Injectable } from "@angular/core";

import { Datos, FirestoreCrud } from "./firestore-crud";
import { Plan } from "../models/modelos";
import { COLECCION_PLANES } from "../utils/constantes";

function convertirBeneficios(beneficios: unknown): string[] {
    const lista: unknown[] = Array.isArray(beneficios)
        ? beneficios
        : String(beneficios ?? "").split("\n");

    return lista
        .map(beneficio => String(beneficio).trim())
        .filter(beneficio => beneficio !== "");
}

@Injectable({ providedIn: "root" })
export class PlanService extends FirestoreCrud<Plan> {

    protected readonly coleccion = COLECCION_PLANES;

    protected preparar(datos: Datos): Datos {
        return {
            nombre: String(datos["nombre"]).trim(),
            precio: Number(datos["precio"]),
            beneficios: convertirBeneficios(datos["beneficios"]),
            activo: Boolean(datos["activo"])
        };
    }
}
