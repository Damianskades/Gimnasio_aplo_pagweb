import logoApolo from "../../assets/img/logo_apolo.jpeg";

const enlaces = [
    { texto: "Inicio", pagina: "inicio", ruta: "index.html" },
    { texto: "Productos", pagina: "productos", ruta: "src/pages/productos.html" },
    { texto: "Planes", pagina: "planes", ruta: "src/pages/planes.html" },
    { texto: "Horarios", pagina: "horarios", ruta: "src/pages/horarios.html" },
    { texto: "Contacto", pagina: "contacto", ruta: "src/pages/contacto.html" }
];

export default function Header(paginaActual, raiz) {
    const menu = enlaces
        .map(enlace => {
            const clase = enlace.pagina === paginaActual ? ' class="activo"' : "";
            return `<a${clase} href="${raiz}${enlace.ruta}">${enlace.texto}</a>`;
        })
        .join("");

    return `
        <header class="cabecera">
            <a class="logo" href="${raiz}index.html">
                <img src="${logoApolo}" alt="Logo de Gimnasio Apolo">
                GIMNASIO APOLO
            </a>
            <nav class="menu">
                ${menu}
            </nav>
        </header>
    `;
}
