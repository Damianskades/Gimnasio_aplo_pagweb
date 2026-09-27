import {
    collection,
    doc,
    getDocs,
    query,
    where,
    addDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import { db } from "../firebase/config.js";
import { COLECCION_PRODUCTOS } from "../utils/constantes.js";

function prepararProducto(datos) {
    return {
        nombre: String(datos.nombre).trim(),
        categoria: String(datos.categoria).trim(),
        precio: Number(datos.precio),
        imagenPrincipal: String(datos.imagenPrincipal).trim(),
        stock: Number(datos.stock),
        activo: Boolean(datos.activo)
    };
}

function convertirDocumento(documento) {
    return { id: documento.id, ...documento.data() };
}

export async function listar() {
    const referencia = collection(db, COLECCION_PRODUCTOS);
    const resultado = await getDocs(referencia);
    return resultado.docs.map(convertirDocumento);
}

export async function listarActivos() {
    const referencia = collection(db, COLECCION_PRODUCTOS);
    const consulta = query(referencia, where("activo", "==", true));
    const resultado = await getDocs(consulta);
    return resultado.docs.map(convertirDocumento);
}

export async function crear(datos) {
    const producto = prepararProducto(datos);
    producto.fechaCreacion = serverTimestamp();

    const referencia = await addDoc(collection(db, COLECCION_PRODUCTOS), producto);
    return referencia.id;
}

export async function actualizar(id, datos) {
    await updateDoc(doc(db, COLECCION_PRODUCTOS, id), prepararProducto(datos));
}

export async function eliminar(id) {
    await deleteDoc(doc(db, COLECCION_PRODUCTOS, id));
}
