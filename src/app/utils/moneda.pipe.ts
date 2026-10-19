import { Pipe, PipeTransform } from "@angular/core";

const formateador = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN"
});

@Pipe({ name: "moneda" })
export class MonedaPipe implements PipeTransform {

    transform(valor: unknown): string {
        const numero = Number(valor);

        return formateador
            .format(Number.isFinite(numero) ? numero : 0)
            .replace(/\s/g, " ");
    }
}
