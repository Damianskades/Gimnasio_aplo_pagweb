import {
    collection,
    doc,
    getDocs,
    query,
    where,
    addDoc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import { db } from "../firebase/config.js";
import { COLECCION_PLANES } from "../utils/constantes.js";

function convertirBeneficios(beneficios) {
    const lista = Array.isArray(beneficios)
        ? beneficios
        : String(beneficios ?? "").split("\n");

    return lista
        .map(beneficio => String(beneficio).trim())
        .filter(beneficio => beneficio !== "");
}

function prepararPlan(datos) {
    return {
        nombre: String(datos.nombre).trim(),
        precio: Number(datos.precio),
        beneficios: convertirBeneficios(datos.beneficios),
        activo: Boolean(datos.activo)
    };
}

function convertirDocumento(documento) {
    return { id: documento.id, ...documento.data() };
}

export async function listar() {
    const referencia = collection(db, COLECCION_PLANES);
    const resultado = await getDocs(referencia);
    return resultado.docs.map(convertirDocumento);
}

export async function listarActivos() {
    const referencia = collection(db, COLECCION_PLANES);
    const consulta = query(referencia, where("activo", "==", true));
    const resultado = await getDocs(consulta);
    return resultado.docs.map(convertirDocumento);
}

export async function crear(datos) {
    const referencia = await addDoc(collection(db, COLECCION_PLANES), prepararPlan(datos));
    return referencia.id;
}

export async function actualizar(id, datos) {
    await updateDoc(doc(db, COLECCION_PLANES, id), prepararPlan(datos));
}

export async function eliminar(id) {
    await deleteDoc(doc(db, COLECCION_PLANES, id));
}
