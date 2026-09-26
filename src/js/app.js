const vistas = {
    inicio: () => import("./views/InicioView.js"),
    productos: () => import("./views/ProductosView.js"),
    planes: () => import("./views/PlanesView.js"),
    horarios: () => import("./views/HorariosView.js"),
    contacto: () => import("./views/ContactoView.js")
};

const contenedor = document.getElementById("app");
const pagina = document.body.dataset.page;
const raiz = document.body.dataset.raiz;
const cargarVista = vistas[pagina] || vistas.inicio;
const modulo = await cargarVista();

modulo.default(contenedor, raiz);
