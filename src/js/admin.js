import * as productoService from "./services/productoService.js";
import * as planService from "./services/planService.js";
import * as horarioService from "./services/horarioService.js";
import escaparHtml from "./utils/escaparHtml.js";
import { DIAS_SEMANA } from "./utils/constantes.js";
import { PRODUCTOS_EJEMPLO, PLANES_EJEMPLO, HORARIOS_EJEMPLO } from "./utils/datosEjemplo.js";

const colecciones = {
    productos: {
        titulo: "Productos",
        tituloNuevo: "Nuevo producto",
        tituloEditar: "Editar producto",
        service: productoService,
        ejemplos: PRODUCTOS_EJEMPLO,
        campos: [
            { nombre: "nombre", etiqueta: "Nombre", tipo: "texto", obligatorio: true },
            { nombre: "marca", etiqueta: "Marca", tipo: "texto", obligatorio: true },
            { nombre: "categoria", etiqueta: "Categoría", tipo: "texto", obligatorio: true },
            { nombre: "descripcion", etiqueta: "Descripción", tipo: "parrafo", obligatorio: true, ancho: true },
            { nombre: "precio", etiqueta: "Precio", tipo: "numero", obligatorio: true },
            { nombre: "precioAnterior", etiqueta: "Precio anterior", tipo: "numero", obligatorio: false },
            { nombre: "imagenPrincipal", etiqueta: "Imagen principal (URL)", tipo: "enlace", obligatorio: true, ancho: true },
            { nombre: "stock", etiqueta: "Stock", tipo: "numero", obligatorio: true },
            { nombre: "activo", etiqueta: "Visible en el sitio", tipo: "casilla", porDefecto: true }
        ]
    },
    planes: {
        titulo: "Suscripciones",
        tituloNuevo: "Nueva suscripción",
        tituloEditar: "Editar suscripción",
        service: planService,
        ejemplos: PLANES_EJEMPLO,
        campos: [
            { nombre: "nombre", etiqueta: "Nombre", tipo: "texto", obligatorio: true },
            { nombre: "precio", etiqueta: "Precio", tipo: "numero", obligatorio: true },
            { nombre: "precioAnterior", etiqueta: "Precio anterior", tipo: "numero", obligatorio: false },
            { nombre: "beneficios", etiqueta: "Beneficios (uno por línea)", tipo: "lista", obligatorio: true, ancho: true },
            { nombre: "destacado", etiqueta: "Marcar como más elegido", tipo: "casilla", porDefecto: false },
            { nombre: "activo", etiqueta: "Visible en el sitio", tipo: "casilla", porDefecto: true }
        ]
    },
    horarios: {
        titulo: "Horarios",
        tituloNuevo: "Nuevo horario",
        tituloEditar: "Editar horario",
        service: horarioService,
        ejemplos: HORARIOS_EJEMPLO,
        campos: [
            { nombre: "clase", etiqueta: "Clase", tipo: "texto", obligatorio: true },
            { nombre: "dias", etiqueta: "Días", tipo: "casillas", opciones: DIAS_SEMANA, obligatorio: true, ancho: true },
            { nombre: "horaInicio", etiqueta: "Hora de inicio", tipo: "hora", obligatorio: true },
            { nombre: "horaFin", etiqueta: "Hora de fin", tipo: "hora", obligatorio: true },
            { nombre: "activo", etiqueta: "Visible en el sitio", tipo: "casilla", porDefecto: true }
        ]
    }
};

const tiposHtml = {
    texto: "text",
    numero: "number",
    enlace: "url",
    hora: "time"
};

const pestanas = document.getElementById("pestanas");
const panel = document.getElementById("panel");

let claveActiva = "productos";
let idEnEdicion = null;

function valorDelCampo(campo, registro) {
    if (campo.tipo === "casilla") {
        return registro ? Boolean(registro[campo.nombre]) : Boolean(campo.porDefecto);
    }

    if (campo.tipo === "casillas") {
        return registro && Array.isArray(registro[campo.nombre]) ? registro[campo.nombre] : [];
    }

    if (!registro) {
        return "";
    }

    const valor = registro[campo.nombre];

    if (campo.tipo === "lista") {
        return Array.isArray(valor) ? valor.join("\n") : "";
    }

    return valor === null || valor === undefined ? "" : String(valor);
}

function textoDeCelda(campo, valor) {
    if (campo.tipo === "casilla") {
        return valor ? "Sí" : "No";
    }

    if (campo.tipo === "lista") {
        return Array.isArray(valor) ? valor.join(" · ") : "—";
    }

    if (campo.tipo === "casillas") {
        return Array.isArray(valor) && valor.length > 0 ? valor.join(", ") : "—";
    }

    if (valor === null || valor === undefined || valor === "") {
        return "—";
    }

    const texto = String(valor);
    return texto.length > 60 ? texto.slice(0, 60) + "…" : texto;
}

function crearCampo(campo, registro) {
    const id = "campo-" + campo.nombre;
    const valor = valorDelCampo(campo, registro);

    if (campo.tipo === "casilla") {
        const marcada = valor ? " checked" : "";
        return `
            <div class="campo campo-casilla">
                <input type="checkbox" id="${id}"${marcada}>
                <label for="${id}">${escaparHtml(campo.etiqueta)}</label>
            </div>
        `;
    }

    if (campo.tipo === "casillas") {
        const casillas = campo.opciones
            .map((opcion, indice) => {
                const idOpcion = id + "-" + indice;
                const marcada = valor.includes(opcion) ? " checked" : "";
                return `
                    <div class="campo-casilla">
                        <input type="checkbox" id="${idOpcion}"${marcada}>
                        <label for="${idOpcion}">${escaparHtml(opcion)}</label>
                    </div>
                `;
            })
            .join("");

        return `
            <div class="campo campo-ancho">
                <label>${escaparHtml(campo.etiqueta)}</label>
                <div class="grupo-casillas">${casillas}</div>
            </div>
        `;
    }

    const etiqueta = campo.obligatorio ? campo.etiqueta : campo.etiqueta + " (opcional)";
    let control = "";

    if (campo.tipo === "parrafo" || campo.tipo === "lista") {
        const filas = campo.tipo === "lista" ? 5 : 3;
        control = `<textarea id="${id}" rows="${filas}">${escaparHtml(valor)}</textarea>`;
    } else {
        const extra = campo.tipo === "numero" ? ' step="0.01" min="0"' : "";
        control = `<input type="${tiposHtml[campo.tipo]}" id="${id}" value="${escaparHtml(valor)}"${extra}>`;
    }

    return `
        <div class="campo${campo.ancho ? " campo-ancho" : ""}">
            <label for="${id}">${escaparHtml(etiqueta)}</label>
            ${control}
        </div>
    `;
}

function crearFormulario(definicion, registro) {
    const editando = Boolean(registro);

    const campos = definicion.campos
        .map(campo => crearCampo(campo, registro))
        .join("");

    const botonCancelar = editando
        ? '<button type="button" class="boton boton-contorno" data-accion="cancelar">Cancelar</button>'
        : "";

    return `
        <form class="recuadro formulario" id="formulario" novalidate>
            <h2>${escaparHtml(editando ? definicion.tituloEditar : definicion.tituloNuevo)}</h2>
            ${campos}
            <div class="acciones">
                <button type="submit" class="boton">${editando ? "Actualizar" : "Guardar"}</button>
                ${botonCancelar}
            </div>
        </form>
    `;
}

function crearTabla(definicion, registros) {
    if (registros.length === 0) {
        return `
            <div class="recuadro">
                <h2>Todos los registros</h2>
                <p class="vacio">Todavía no hay registros. Usa el formulario de arriba para crear el primero, o carga los datos de ejemplo.</p>
                <div class="acciones">
                    <button type="button" class="boton" data-accion="sembrar">Cargar ${definicion.ejemplos.length} datos de ejemplo</button>
                </div>
            </div>
        `;
    }

    const encabezados = definicion.campos
        .map(campo => `<th>${escaparHtml(campo.etiqueta)}</th>`)
        .join("");

    const filas = registros
        .map(registro => {
            const celdas = definicion.campos
                .map(campo => `<td>${escaparHtml(textoDeCelda(campo, registro[campo.nombre]))}</td>`)
                .join("");

            return `
                <tr>
                    ${celdas}
                    <td>
                        <div class="acciones-fila">
                            <button type="button" class="boton" data-accion="editar" data-id="${registro.id}">Editar</button>
                            <button type="button" class="boton boton-contorno" data-accion="eliminar" data-id="${registro.id}">Eliminar</button>
                        </div>
                    </td>
                </tr>
            `;
        })
        .join("");

    return `
        <div class="recuadro">
            <h2>Todos los registros (${registros.length})</h2>
            <div class="tabla-scroll">
                <table class="tabla-admin">
                    <thead>
                        <tr>
                            ${encabezados}
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filas}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function crearMensaje(texto, tipo) {
    const clase = tipo === "error" ? "mensaje mensaje-error" : "mensaje";
    const oculto = texto ? "" : " hidden";
    return `<p class="${clase}" id="mensaje-admin"${oculto}>${escaparHtml(texto)}</p>`;
}

function dibujarPestanas() {
    pestanas.innerHTML = Object.keys(colecciones)
        .map(clave => {
            const clase = clave === claveActiva ? "pestana activa" : "pestana";
            return `<button type="button" class="${clase}" data-clave="${clave}">${colecciones[clave].titulo}</button>`;
        })
        .join("");
}

function ordenar(definicion, registros) {
    const primerCampo = definicion.campos[0].nombre;

    return [...registros].sort((uno, otro) => {
        const valorUno = String(uno[primerCampo] === undefined ? "" : uno[primerCampo]);
        const valorOtro = String(otro[primerCampo] === undefined ? "" : otro[primerCampo]);
        return valorUno.localeCompare(valorOtro, "es");
    });
}

function mostrarMensaje(texto, tipo) {
    const elemento = document.getElementById("mensaje-admin");
    elemento.textContent = texto;
    elemento.className = tipo === "error" ? "mensaje mensaje-error" : "mensaje";
    elemento.hidden = texto === "";
}

async function refrescar(texto, tipo) {
    const definicion = colecciones[claveActiva];
    panel.innerHTML = '<p class="cargando">Cargando registros...</p>';

    let registros = [];
    let error = "";

    try {
        registros = await definicion.service.listar();
    } catch (fallo) {
        console.error(fallo);
        error = "No se pudo leer la base de datos. Revisa tu conexión a internet.";
    }

    const registro = idEnEdicion
        ? registros.find(fila => fila.id === idEnEdicion)
        : null;

    if (idEnEdicion && !registro) {
        idEnEdicion = null;
    }

    const mensaje = error ? error : texto;

    panel.innerHTML =
        crearMensaje(mensaje === undefined ? "" : mensaje, error ? "error" : tipo) +
        crearFormulario(definicion, registro) +
        crearTabla(definicion, ordenar(definicion, registros));
}

function leerFormulario(definicion) {
    const datos = {};

    for (const campo of definicion.campos) {
        if (campo.tipo === "casillas") {
            datos[campo.nombre] = campo.opciones.filter((opcion, indice) =>
                document.getElementById("campo-" + campo.nombre + "-" + indice).checked
            );
            continue;
        }

        const elemento = document.getElementById("campo-" + campo.nombre);
        datos[campo.nombre] = campo.tipo === "casilla"
            ? elemento.checked
            : elemento.value.trim();
    }

    return datos;
}

function estaVacio(campo, valor) {
    if (campo.tipo === "casillas") {
        return valor.length === 0;
    }

    return valor === "";
}

function validar(definicion, datos) {
    const faltantes = definicion.campos
        .filter(campo => campo.obligatorio && estaVacio(campo, datos[campo.nombre]))
        .map(campo => campo.etiqueta);

    if (faltantes.length > 0) {
        return "Falta completar: " + faltantes.join(", ") + ".";
    }

    const invalidos = definicion.campos
        .filter(campo => campo.tipo === "numero" && datos[campo.nombre] !== "")
        .filter(campo => {
            const numero = Number(datos[campo.nombre]);
            return !Number.isFinite(numero) || numero < 0;
        })
        .map(campo => campo.etiqueta);

    if (invalidos.length > 0) {
        return "Debe ser un número mayor o igual a cero: " + invalidos.join(", ") + ".";
    }

    return "";
}

async function guardar() {
    const definicion = colecciones[claveActiva];
    const datos = leerFormulario(definicion);
    const error = validar(definicion, datos);

    if (error) {
        mostrarMensaje(error, "error");
        return;
    }

    try {
        if (idEnEdicion) {
            await definicion.service.actualizar(idEnEdicion, datos);
            idEnEdicion = null;
            await refrescar("Se actualizó el registro correctamente.", "exito");
        } else {
            await definicion.service.crear(datos);
            await refrescar("Se guardó el registro correctamente.", "exito");
        }
    } catch (fallo) {
        console.error(fallo);
        mostrarMensaje("No se pudo guardar. Revisa tu conexión a internet.", "error");
    }
}

async function editar(id) {
    idEnEdicion = id;
    await refrescar("Estás editando un registro. Cambia lo que necesites y pulsa Actualizar.", "exito");
    document.getElementById("formulario").scrollIntoView({ behavior: "smooth", block: "start" });
}

async function eliminar(id) {
    const confirmado = window.confirm("¿Seguro que quieres eliminar este registro? Esta acción no se puede deshacer.");

    if (!confirmado) {
        return;
    }

    try {
        await colecciones[claveActiva].service.eliminar(id);

        if (idEnEdicion === id) {
            idEnEdicion = null;
        }

        await refrescar("Se eliminó el registro.", "exito");
    } catch (fallo) {
        console.error(fallo);
        mostrarMensaje("No se pudo eliminar. Revisa tu conexión a internet.", "error");
    }
}

async function sembrar() {
    const definicion = colecciones[claveActiva];
    const cantidad = definicion.ejemplos.length;
    const confirmado = window.confirm("Se van a crear " + cantidad + " registros de ejemplo en " + definicion.titulo + ". ¿Continuar?");

    if (!confirmado) {
        return;
    }

    try {
        for (const ejemplo of definicion.ejemplos) {
            await definicion.service.crear(ejemplo);
        }

        await refrescar("Se cargaron " + cantidad + " registros de ejemplo.", "exito");
    } catch (fallo) {
        console.error(fallo);
        await refrescar("No se pudieron cargar todos los datos de ejemplo. Revisa tu conexión a internet.", "error");
    }
}

async function cancelar() {
    idEnEdicion = null;
    await refrescar();
}

async function mostrarPestana(clave) {
    claveActiva = clave;
    idEnEdicion = null;
    dibujarPestanas();
    await refrescar();
}

pestanas.addEventListener("click", evento => {
    const boton = evento.target.closest("[data-clave]");

    if (boton) {
        mostrarPestana(boton.dataset.clave);
    }
});

panel.addEventListener("submit", evento => {
    evento.preventDefault();
    guardar();
});

panel.addEventListener("click", evento => {
    const boton = evento.target.closest("[data-accion]");

    if (!boton) {
        return;
    }

    if (boton.dataset.accion === "editar") {
        editar(boton.dataset.id);
    }

    if (boton.dataset.accion === "eliminar") {
        eliminar(boton.dataset.id);
    }

    if (boton.dataset.accion === "cancelar") {
        cancelar();
    }

    if (boton.dataset.accion === "sembrar") {
        sembrar();
    }
});

dibujarPestanas();
refrescar();
