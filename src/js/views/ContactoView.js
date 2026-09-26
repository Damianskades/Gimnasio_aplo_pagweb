import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import Tarjeta from "../components/Tarjeta.js";

const preciosPorPlan = {
    "Día libre": 15,
    "Mensual Básico": 89,
    "Mensual Full": 129,
    "Trimestral Full": 330,
    "Anual Apolo": 1090
};

const datosContacto = [
    { titulo: "DIRECCIÓN", texto: "Vista Alegre, Tarma, Junin" },
    { titulo: "TELÉFONO", texto: "945 231 423" },
    { titulo: "WHATSAPP", texto: "987 654 321" },
    { titulo: "CORREO", texto: "serviciosg@gimnasioapolo.pe" }
];

function registrar() {
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const correo = document.getElementById("correo").value;
    const plan = document.getElementById("plan").value;
    const mensaje = document.getElementById("mensaje");

    if (nombre === "" || apellido === "" || correo === "") {
        mensaje.textContent = "Debes completar todos los campos.";
        mensaje.style.color = "red";
        return;
    }

    const precio = preciosPorPlan[plan];

    mensaje.textContent = "Hola " + nombre + " " + apellido + ", tu inscripción al plan " + plan +
        " por S/ " + precio + " fue registrada. Te escribiremos a " + correo;
    mensaje.style.color = "var(--dorado)";
}

export default function ContactoView(contenedor, raiz) {
    const opciones = Object.keys(preciosPorPlan)
        .map(plan => `<option value="${plan}">${plan}</option>`)
        .join("");

    contenedor.innerHTML = `
        ${Header("contacto", raiz)}

        <main>

            <section class="titulo">
                <h1>INSCRÍBETE</h1>
                <p class="intro">Completa tus datos y nos comunicamos contigo.</p>
            </section>

            <section class="formulario">
                <div class="bloque">

                    <label for="nombre">Nombre</label>
                    <input type="text" id="nombre" name="nombre">

                    <label for="apellido">Apellido</label>
                    <input type="text" id="apellido" name="apellido">

                    <label for="correo">Correo</label>
                    <input type="email" id="correo" name="correo">

                    <label for="plan">Plan</label>
                    <select id="plan" name="plan">
                        ${opciones}
                    </select>

                    <button class="boton" id="boton-registrar">ENVIAR</button>

                </div>

                <p id="mensaje"></p>

            </section>

            <section class="datos">
                <h2>DATOS DE CONTACTO</h2>
                <div class="tarjetas">
                    ${datosContacto.map(Tarjeta).join("")}
                </div>
            </section>

        </main>

        ${Footer()}
    `;

    document
        .getElementById("boton-registrar")
        .addEventListener("click", registrar);
}
