import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import Tarjeta from "../components/Tarjeta.js";
import Cargando from "../components/Cargando.js";
import escaparHtml from "../utils/escaparHtml.js";
import { DIAS_SEMANA } from "../utils/constantes.js";
import { listarActivos } from "../services/horarioService.js";

const horariosAtencion = [
    { titulo: "LUNES A VIERNES", texto: "5:00 a.m. – 11:00 p.m." },
    { titulo: "SÁBADOS", texto: "6:00 a.m. – 9:00 p.m." },
    { titulo: "DOMINGOS Y FERIADOS", texto: "7:00 a.m. – 2:00 p.m." },
    { titulo: "MENOR CONCURRENCIA", texto: "10:00 a.m. – 4:00 p.m." }
];

const reglas = [
    "Uso obligatorio de toalla.",
    "Limpiar el equipo después de usarlo.",
    "No reservar máquinas."
];

function formatoHora(hora) {
    const partes = String(hora).split(":");
    const horas = Number(partes[0]);

    if (!Number.isFinite(horas)) {
        return String(hora);
    }

    const minutos = partes[1] === undefined ? "00" : partes[1];
    const sufijo = horas < 12 ? "a.m." : "p.m.";
    const horaDeReloj = horas % 12 === 0 ? 12 : horas % 12;

    return horaDeReloj + ":" + minutos + " " + sufijo;
}

function unirConY(partes) {
    if (partes.length <= 1) {
        return partes.join("");
    }

    return partes.slice(0, -1).join(", ") + " y " + partes[partes.length - 1];
}

function primerDia(horario) {
    const indices = (Array.isArray(horario.dias) ? horario.dias : [])
        .map(dia => DIAS_SEMANA.indexOf(dia))
        .filter(indice => indice >= 0);

    return indices.length === 0 ? DIAS_SEMANA.length : Math.min(...indices);
}

function ordenarHorarios(horarios) {
    return [...horarios].sort((uno, otro) => {
        const diferencia = primerDia(uno) - primerDia(otro);

        if (diferencia !== 0) {
            return diferencia;
        }

        return String(uno.horaInicio).localeCompare(String(otro.horaInicio));
    });
}

function crearFilaClase(horario, indice) {
    const claseFila = indice % 2 === 0 ? "fila-clara" : "fila-oscura";
    const dias = Array.isArray(horario.dias) ? horario.dias : [];
    const horas = formatoHora(horario.horaInicio) + " – " + formatoHora(horario.horaFin);

    return `
        <tr class="${claseFila}">
            <td>${escaparHtml(horario.clase)}</td>
            <td>${unirConY(dias.map(escaparHtml))}</td>
            <td>${horas}</td>
        </tr>
    `;
}

function crearTabla(horarios) {
    return `
        <table class="tabla">
            <tr>
                <th>Clase</th>
                <th>Días</th>
                <th>Horas</th>
            </tr>
            ${horarios.map(crearFilaClase).join("")}
        </table>
    `;
}

export default async function HorariosView(contenedor, raiz) {
    contenedor.innerHTML = `
        ${Header("horarios", raiz)}

        <main>

            <section class="titulo">
                <h1>HORARIOS</h1>
            </section>

            <section class="atencion">
                <h2>HORARIO DE ATENCIÓN</h2>
                <div class="tarjetas">
                    ${horariosAtencion.map(Tarjeta).join("")}
                </div>
            </section>

            <section class="clases">
                <h2>CLASES GRUPALES</h2>
                <div id="lista-clases">
                    ${Cargando("Cargando las clases grupales...")}
                </div>
            </section>

            <section class="reglas">
                <h2>REGLAS DEL GIMNASIO</h2>
                <div class="bloque">
                    <ul class="lista">
                        ${reglas.map(regla => `<li>${regla}</li>`).join("")}
                    </ul>
                </div>
            </section>

        </main>

        ${Footer()}
    `;

    const lista = document.getElementById("lista-clases");

    try {
        const horarios = await listarActivos();

        if (horarios.length === 0) {
            lista.innerHTML = '<p class="aviso">Todavía no hay clases grupales publicadas. Consúltanos en recepción.</p>';
            return;
        }

        lista.innerHTML = crearTabla(ordenarHorarios(horarios));
    } catch (fallo) {
        console.error(fallo);
        lista.innerHTML = '<p class="aviso">No pudimos cargar las clases grupales. Revisa tu conexión a internet e intenta de nuevo.</p>';
    }
}
