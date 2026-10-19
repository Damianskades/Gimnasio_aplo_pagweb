import { Component, input } from "@angular/core";

@Component({
    selector: "app-cargando",
    template: `
        <div class="cargando d-flex align-items-center gap-3" role="status">
            <span class="spinner-border text-primary" aria-hidden="true"></span>
            <span>{{ mensaje() }}</span>
        </div>
    `
})
export class Cargando {
    readonly mensaje = input("Cargando...");
}
