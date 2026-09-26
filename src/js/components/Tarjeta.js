export default function Tarjeta(tarjeta) {
    const imagen = tarjeta.imagen
        ? `<img src="${tarjeta.imagen}" alt="${tarjeta.textoAlternativo}">`
        : "";

    return `
        <div class="tarjeta">
            ${imagen}
            <h3>${tarjeta.titulo}</h3>
            <p>${tarjeta.texto}</p>
        </div>
    `;
}
