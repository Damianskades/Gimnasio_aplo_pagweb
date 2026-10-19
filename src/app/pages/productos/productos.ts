import { Component, inject, OnInit, signal } from "@angular/core";

import { Cargando } from "../../components/cargando/cargando";
import { Producto } from "../../models/modelos";
import { ProductoService } from "../../services/producto.service";
import { CarritoService } from "../../services/carrito.service";
import { MonedaPipe } from "../../utils/moneda.pipe";

type Estado = "cargando" | "listo" | "error";

@Component({
    selector: "app-productos",
    imports: [Cargando, MonedaPipe],
    templateUrl: "./productos.html",
    styleUrl: "./productos.css"
})
export class Productos implements OnInit {

    private readonly productoService = inject(ProductoService);
    protected readonly carrito = inject(CarritoService);

    protected readonly estado = signal<Estado>("cargando");
    protected readonly productos = signal<Producto[]>([]);

    async ngOnInit() {
        try {
            const productos = await this.productoService.listarActivos();

            this.productos.set([...productos].sort((uno, otro) =>
                String(uno.nombre).localeCompare(String(otro.nombre), "es")
            ));
            this.estado.set("listo");
        } catch (fallo) {
            console.error(fallo);
            this.estado.set("error");
        }
    }

    protected agotado(producto: Producto): boolean {
        return Number(producto.stock) === 0;
    }

    protected sinStockDisponible(producto: Producto): boolean {
        return this.carrito.cantidadDe(producto.id ?? "") >= Number(producto.stock);
    }
}
