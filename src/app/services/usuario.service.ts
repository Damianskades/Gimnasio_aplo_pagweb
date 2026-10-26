import { Injectable } from "@angular/core";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";

import { Datos, FirestoreCrud } from "./firestore-crud";
import { db } from "../core/firestore";
import { Usuario } from "../models/modelos";
import { COLECCION_USUARIOS } from "../utils/constantes";

export async function registrarUsuario(usuario: User, nuevo: boolean) {
    const datos: Datos = {
        nombre: usuario.displayName ?? "",
        correo: usuario.email ?? "",
        ultimoIngreso: serverTimestamp()
    };

    if (nuevo) {
        datos["fechaRegistro"] = serverTimestamp();
    }

    await setDoc(doc(db, COLECCION_USUARIOS, usuario.uid), datos, { merge: true });
}

export async function leerRol(uid: string): Promise<string> {
    const documento = await getDoc(doc(db, COLECCION_USUARIOS, uid));
    return documento.exists() ? String(documento.data()["rol"] ?? "") : "";
}

@Injectable({ providedIn: "root" })
export class UsuarioService extends FirestoreCrud<Usuario> {

    protected readonly coleccion = COLECCION_USUARIOS;

    protected preparar(datos: Datos): Datos {
        return {
            nombre: String(datos["nombre"] ?? "").trim(),
            correo: String(datos["correo"] ?? "").trim()
        };
    }
}
