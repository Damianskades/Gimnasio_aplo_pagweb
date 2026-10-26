import { Component, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";

import { ItemCarrito } from "../../models/modelos";
import { AuthService } from "../../services/auth.service";
import { CarritoService } from "../../services/carrito.service";
import { ErrorDePedido, PedidoService } from "../../services/pedido.service";
import { MonedaPipe } from "../../utils/moneda.pipe";

interface PedidoConfirmado {
    total: number;
    unidades: number;
}

@Component({
    selector: "app-carrito",
    imports: [RouterLink, MonedaPipe],
    templateUrl: "./carrito.html",
    styleUrl: "./carrito.css"
})
export class Carrito {

    protected readonly carrito = inject(CarritoService);
    protected readonly auth = inject(AuthService);
    private readonly pedidoService = inject(PedidoService);
    private readonly router = inject(Router);

    protected readonly procesando = signal(false);
    protected readonly error = signal("");
    protected readonly confirmado = signal<PedidoConfirmado | null>(null);

    protected sumar(item: ItemCarrito) {
        this.carrito.cambiarCantidad(item.id, item.cantidad + 1);
    }

    protected restar(item: ItemCarrito) {
        this.carrito.cambiarCantidad(item.id, item.cantidad - 1);
    }

    protected async finalizarCompra() {
        const usuario = this.auth.usuario();

        if (!usuario) {
            this.router.navigate(["/login"], { queryParams: { volver: "/carrito" } });
            return;
        }

        this.error.set("");
        this.procesando.set(true);

        const items = this.carrito.items();

        try {
            await this.pedidoService.registrar(usuario, items);

            this.confirmado.set({
                total: this.carrito.total(),
                unidades: this.carrito.cantidadTotal()
            });
            this.carrito.vaciar();
        } catch (fallo) {
            console.error(fallo);
            this.error.set(fallo instanceof ErrorDePedido
                ? fallo.message
                : "No se pudo registrar tu pedido. Revisa tu conexión a internet e intenta de nuevo.");
        } finally {
            this.procesando.set(false);
        }
    }
}
