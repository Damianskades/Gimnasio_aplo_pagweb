import { Component, input } from "@angular/core";
import { TarjetaInfo } from "../../models/modelos";

@Component({
    selector: "app-tarjeta",
    host: { class: "d-block h-100" },
    template: `
        <div class="card tarjeta h-100">
            @if (tarjeta().imagen) {
                <img class="card-img-top" [src]="tarjeta().imagen" [alt]="tarjeta().textoAlternativo ?? ''">
            }
            <div class="card-body px-0 pb-0">
                <h3 class="card-title">{{ tarjeta().titulo }}</h3>
                <p class="card-text">{{ tarjeta().texto }}</p>
            </div>
        </div>
    `,
    styles: `
        .tarjeta {
            padding: 25px;
        }

        .card-img-top {
            height: 180px;
            object-fit: cover;
            border: 3px solid var(--dorado);
        }

        .card-body {
            padding-top: 20px;
        }

        .card-title {
            font-size: 22px;
            margin-bottom: 12px;
        }

        .card-text {
            font-size: 16px;
            line-height: 1.6;
        }
    `
})
export class Tarjeta {
    readonly tarjeta = input.required<TarjetaInfo>();
}
