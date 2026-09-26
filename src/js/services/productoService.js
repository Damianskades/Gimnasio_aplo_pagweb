import {
    collection,
    doc,
    getDocs,
    query,
    where,
    addDoc,
    updateDoc,
    deleteDoc,
    deleteField,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import { db } from "../firebase/config.js";
import { COLECCION_PRODUCTOS } from "../utils/constantes.js";

function tieneValor(valor) {
    return valor !== "" && valor !== null && valor !== undefined;
}

function prepararProducto(datos) {
    return {
        nombre: String(datos.nombre).trim(),
        marca: String(datos.marca).trim(),
        categoria: String(datos.categoria).trim(),
        descripcion: String(datos.descripcion).trim(),
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

    if (tieneValor(datos.precioAnterior)) {
        producto.precioAnterior = Number(datos.precioAnterior);
    }

    const referencia = await addDoc(collection(db, COLECCION_PRODUCTOS), producto);
    return referencia.id;
}

export async function actualizar(id, datos) {
    const producto = prepararProducto(datos);

    producto.precioAnterior = tieneValor(datos.precioAnterior)
        ? Number(datos.precioAnterior)
        : deleteField();

    await updateDoc(doc(db, COLECCION_PRODUCTOS, id), producto);
}

export async function eliminar(id) {
    await deleteDoc(doc(db, COLECCION_PRODUCTOS, id));
}
