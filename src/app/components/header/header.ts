import { Component, inject, signal } from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";

import { AuthService } from "../../services/auth.service";
import { CarritoService } from "../../services/carrito.service";

@Component({
    selector: "app-header",
    imports: [RouterLink, RouterLinkActive],
    templateUrl: "./header.html",
    styleUrl: "./header.css"
})
export class Header {

    protected readonly auth = inject(AuthService);
    protected readonly carrito = inject(CarritoService);
    private readonly router = inject(Router);

    protected readonly enlaces = [
        { texto: "Inicio", ruta: "/" },
        { texto: "Productos", ruta: "/productos" },
        { texto: "Planes", ruta: "/planes" },
        { texto: "Horarios", ruta: "/horarios" },
        { texto: "Contacto", ruta: "/contacto" }
    ];

    protected readonly menuAbierto = signal(false);

    alternarMenu() {
        this.menuAbierto.update(abierto => !abierto);
    }

    cerrarMenu() {
        this.menuAbierto.set(false);
    }

    async salir() {
        this.cerrarMenu();
        await this.auth.salir();
        this.router.navigateByUrl("/");
    }
}
