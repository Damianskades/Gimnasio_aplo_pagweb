import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import Tarjeta from "../components/Tarjeta.js";
import logoApolo from "../../assets/img/logo_apolo.jpeg";
import imagenPesas from "../../assets/img/pesas.jpg";
import imagenCardio from "../../assets/img/cardio.jpeg";
import imagenFuncional from "../../assets/img/funcional.jpg";
import imagenDuchas from "../../assets/img/duchas.jpg";
import imagenEstacionamiento from "../../assets/img/estacionamiento.png";
import imagenTienda from "../../assets/img/tienda.jpg";

const servicios = [
    {
        titulo: "SALA DE PESAS",
        texto: "Máquinas y peso libre para todos los niveles.",
        imagen: imagenPesas,
        textoAlternativo: "Sala de pesas del gimnasio"
    },
    {
        titulo: "ZONA CARDIO",
        texto: "Trotadoras, elípticas y bicicletas estáticas.",
        imagen: imagenCardio,
        textoAlternativo: "Zona cardio con trotadoras"
    },
    {
        titulo: "ÁREA FUNCIONAL",
        texto: "Espacio abierto para entrenamiento funcional.",
        imagen: imagenFuncional,
        textoAlternativo: "Área funcional con implementos"
    },
    {
        titulo: "DUCHAS Y VESTIDORES",
        texto: "Vestidores amplios con casilleros y duchas.",
        imagen: imagenDuchas,
        textoAlternativo: "Duchas y vestidores"
    },
    {
        titulo: "ESTACIONAMIENTO",
        texto: "Estacionamiento gratuito para socios.",
        imagen: imagenEstacionamiento,
        textoAlternativo: "Estacionamiento del gimnasio"
    },
    {
        titulo: "TIENDA DE SUPLEMENTOS",
        texto: "Proteínas y suplementos de marcas originales.",
        imagen: imagenTienda,
        textoAlternativo: "Tienda de suplementos"
    }
];

export default function InicioView(contenedor, raiz) {
    contenedor.innerHTML = `
        ${Header("inicio", raiz)}

        <main>

            <section class="hero">
                <h1>GIMNASIO APOLO</h1>
                <p class="eslogan">Entrena como un caballero, entrena como Apolo.</p>
                <a class="boton" href="${raiz}src/pages/planes.html">VER PLANES</a>
            </section>

            <section class="marca">
                <div class="marca-texto">
                    <h2>APOLO</h2>
                    <p>Nuestro nombre viene del dios del sol, la fuerza y la disciplina. Ese es el espíritu que buscamos en
                        cada persona que entrena con nosotros, sin importar el nivel con el que empiece.</p>
                </div>
                <div class="marca-logo">
                    <img src="${logoApolo}" alt="Logo de Gimnasio Apolo">
                </div>
            </section>

            <section class="nosotros">
                <h2>NOSOTROS</h2>
                <div class="bloque">
                    <p>Gimnasio Apolo fue fundado en 2022 y tiene su sede en Vista Alegre , Tarma, Junin. Contamos
                        con 6 entrenadores certificados y 1 nutricionista que acompañan tu progreso desde el primer día.</p>
                </div>
            </section>

            <section class="servicios">
                <h2>SERVICIOS</h2>
                <div class="tarjetas">
                    ${servicios.map(Tarjeta).join("")}
                </div>
            </section>

        </main>

        ${Footer()}
    `;
}
