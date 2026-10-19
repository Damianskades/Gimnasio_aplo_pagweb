import { Injectable } from "@angular/core";

import { Datos, FirestoreCrud } from "./firestore-crud";
import { Horario } from "../models/modelos";
import { COLECCION_HORARIOS, DIAS_SEMANA } from "../utils/constantes";

function convertirDias(dias: unknown): string[] {
    const lista: unknown[] = Array.isArray(dias) ? dias : [];

    return DIAS_SEMANA.filter(dia => lista.includes(dia));
}

@Injectable({ providedIn: "root" })
export class HorarioService extends FirestoreCrud<Horario> {

    protected readonly coleccion = COLECCION_HORARIOS;

    protected preparar(datos: Datos): Datos {
        return {
            clase: String(datos["clase"]).trim(),
            dias: convertirDias(datos["dias"]),
            horaInicio: String(datos["horaInicio"]).trim(),
            horaFin: String(datos["horaFin"]).trim(),
            activo: Boolean(datos["activo"])
        };
    }
}
