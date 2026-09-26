import {
    collection,
    doc,
    getDocs,
    query,
    where,
    addDoc,
    updateDoc,
    deleteDoc,
    deleteField
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import { db } from "../firebase/config.js";
import { COLECCION_PLANES } from "../utils/constantes.js";

function tieneValor(valor) {
    return valor !== "" && valor !== null && valor !== undefined;
}

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
        destacado: Boolean(datos.destacado),
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
    const plan = prepararPlan(datos);

    if (tieneValor(datos.precioAnterior)) {
        plan.precioAnterior = Number(datos.precioAnterior);
    }

    const referencia = await addDoc(collection(db, COLECCION_PLANES), plan);
    return referencia.id;
}

export async function actualizar(id, datos) {
    const plan = prepararPlan(datos);

    plan.precioAnterior = tieneValor(datos.precioAnterior)
        ? Number(datos.precioAnterior)
        : deleteField();

    await updateDoc(doc(db, COLECCION_PLANES, id), plan);
}

export async function eliminar(id) {
    await deleteDoc(doc(db, COLECCION_PLANES, id));
}
