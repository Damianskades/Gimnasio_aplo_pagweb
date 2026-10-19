import {
    collection,
    doc,
    getDocs,
    query,
    where,
    addDoc,
    updateDoc,
    deleteDoc,
    QueryDocumentSnapshot
} from "firebase/firestore";

import { db } from "../core/firestore";
import { ServicioCrud } from "../models/modelos";

export type Datos = Record<string, unknown>;

function convertirDocumento<T>(documento: QueryDocumentSnapshot): T {
    return { id: documento.id, ...documento.data() } as T;
}

export abstract class FirestoreCrud<T> implements ServicioCrud<T> {

    protected abstract readonly coleccion: string;

    protected abstract preparar(datos: Datos): Datos;

    async listar(): Promise<T[]> {
        const resultado = await getDocs(collection(db, this.coleccion));
        return resultado.docs.map(documento => convertirDocumento<T>(documento));
    }

    async listarActivos(): Promise<T[]> {
        const consulta = query(collection(db, this.coleccion), where("activo", "==", true));
        const resultado = await getDocs(consulta);
        return resultado.docs.map(documento => convertirDocumento<T>(documento));
    }

    async crear(datos: object): Promise<string> {
        const registro = this.alCrear(this.preparar(datos as Datos));
        const referencia = await addDoc(collection(db, this.coleccion), registro);
        return referencia.id;
    }

    async actualizar(id: string, datos: object): Promise<void> {
        await updateDoc(doc(db, this.coleccion, id), this.preparar(datos as Datos));
    }

    async eliminar(id: string): Promise<void> {
        await deleteDoc(doc(db, this.coleccion, id));
    }

    protected alCrear(datos: Datos): Datos {
        return datos;
    }
}
