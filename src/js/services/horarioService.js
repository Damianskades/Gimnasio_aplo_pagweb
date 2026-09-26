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
import { COLECCION_HORARIOS, DIAS_SEMANA } from "../utils/constantes.js";

function convertirDias(dias) {
    const lista = Array.isArray(dias) ? dias : [];

    return DIAS_SEMANA.filter(dia => lista.includes(dia));
}

function prepararHorario(datos) {
    return {
        clase: String(datos.clase).trim(),
        dias: convertirDias(datos.dias),
        horaInicio: String(datos.horaInicio).trim(),
        horaFin: String(datos.horaFin).trim(),
        activo: Boolean(datos.activo)
    };
}

function convertirDocumento(documento) {
    return { id: documento.id, ...documento.data() };
}

export async function listar() {
    const referencia = collection(db, COLECCION_HORARIOS);
    const resultado = await getDocs(referencia);
    return resultado.docs.map(convertirDocumento);
}

export async function listarActivos() {
    const referencia = collection(db, COLECCION_HORARIOS);
    const consulta = query(referencia, where("activo", "==", true));
    const resultado = await getDocs(consulta);
    return resultado.docs.map(convertirDocumento);
}

export async function crear(datos) {
    const horario = prepararHorario(datos);
    const referencia = await addDoc(collection(db, COLECCION_HORARIOS), horario);
    return referencia.id;
}

export async function actualizar(id, datos) {
    await updateDoc(doc(db, COLECCION_HORARIOS, id), prepararHorario(datos));
}

export async function eliminar(id) {
    await deleteDoc(doc(db, COLECCION_HORARIOS, id));
}
