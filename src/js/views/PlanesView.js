import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import Cargando from "../components/Cargando.js";
import escaparHtml from "../utils/escaparHtml.js";
import formatoMoneda from "../utils/formatoMoneda.js";
import { listarActivos } from "../services/planService.js";

function crearTarjetaPlan(plan, raiz) {
    const beneficios = Array.isArray(plan.beneficios)
        ? plan.beneficios.map(beneficio => `<li>${escaparHtml(beneficio)}</li>`).join("")
        : "";

    return `
        <div class="tarjeta">
            <h2>${escaparHtml(plan.nombre)}</h2>
            <p class="precio">${formatoMoneda(plan.precio)}</p>
            <ul class="beneficios">
                ${beneficios}
            </ul>
            <a class="boton" href="${raiz}src/pages/contacto.html">INSCRIBIRME</a>
        </div>
    `;
}

function ordenarPorPrecio(planes) {
    return [...planes].sort((uno, otro) => Number(uno.precio) - Number(otro.precio));
}

export default async function PlanesView(contenedor, raiz) {
    contenedor.innerHTML = `
        ${Header("planes", raiz)}

        <main>

            <section class="titulo">
                <h1>NUESTRAS MEMBRESÍAS</h1>
                <p class="intro">Elige el plan que se acomoda a tu ritmo de entrenamiento.</p>
            </section>

            <section class="planes">
                <div id="lista-planes">
                    ${Cargando("Cargando las membresías...")}
                </div>
            </section>

        </main>

        ${Footer()}
    `;

    const lista = document.getElementById("lista-planes");

    try {
        const planes = await listarActivos();

        if (planes.length === 0) {
            lista.innerHTML = '<p class="aviso">Todavía no hay membresías publicadas. Escríbenos y te contamos las opciones.</p>';
            return;
        }

        const tarjetas = ordenarPorPrecio(planes)
            .map(plan => crearTarjetaPlan(plan, raiz))
            .join("");

        lista.innerHTML = `<div class="tarjetas">${tarjetas}</div>`;
    } catch (fallo) {
        console.error(fallo);
        lista.innerHTML = '<p class="aviso">No pudimos cargar las membresías. Revisa tu conexión a internet e intenta de nuevo.</p>';
    }
}
