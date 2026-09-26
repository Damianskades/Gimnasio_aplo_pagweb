const formateador = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN"
});

export default function formatoMoneda(valor) {
    const numero = Number(valor);
    return formateador.format(Number.isFinite(numero) ? numero : 0);
}
