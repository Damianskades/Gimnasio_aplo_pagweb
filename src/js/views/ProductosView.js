import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import Cargando from "../components/Cargando.js";
import escaparHtml from "../utils/escaparHtml.js";
import formatoMoneda from "../utils/formatoMoneda.js";
import { listarActivos } from "../services/productoService.js";

function crearTarjetaProducto(producto) {
    const nombre = escaparHtml(producto.nombre);

    const agotado = Number(producto.stock) === 0
        ? '<span class="etiqueta-agotado">AGOTADO</span>'
        : "";

    return `
        <article class="tarjeta tarjeta-producto">
            <div class="producto-imagen">
                <img src="${escaparHtml(producto.imagenPrincipal)}" alt="${nombre}">
                ${agotado}
            </div>
            <h3>${nombre}</h3>
            <p class="precio">${formatoMoneda(producto.precio)}</p>
        </article>
    `;
}

function ordenarPorNombre(productos) {
    return [...productos].sort((uno, otro) =>
        String(uno.nombre).localeCompare(String(otro.nombre), "es")
    );
}

export default async function ProductosView(contenedor, raiz) {
    contenedor.innerHTML = `
        ${Header("productos", raiz)}

        <main>

            <section class="titulo">
                <h1>PRODUCTOS</h1>
                <p class="intro">Suplementos y accesorios originales para tu entrenamiento.</p>
            </section>

            <section class="productos">
                <div id="lista-productos">
                    ${Cargando("Cargando los productos...")}
                </div>
            </section>

        </main>

        ${Footer()}
    `;

    const lista = document.getElementById("lista-productos");

    try {
        const productos = await listarActivos();

        if (productos.length === 0) {
            lista.innerHTML = '<p class="aviso">Todavía no hay productos publicados. Vuelve a revisar pronto.</p>';
            return;
        }

        const tarjetas = ordenarPorNombre(productos)
            .map(crearTarjetaProducto)
            .join("");

        lista.innerHTML = `<div class="rejilla">${tarjetas}</div>`;
    } catch (fallo) {
        console.error(fallo);
        lista.innerHTML = '<p class="aviso">No pudimos cargar los productos. Revisa tu conexión a internet e intenta de nuevo.</p>';
    }
}
