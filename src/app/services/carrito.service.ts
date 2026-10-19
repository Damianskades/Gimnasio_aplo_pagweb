import { computed, effect, Injectable, signal } from "@angular/core";

import { ItemCarrito, Producto } from "../models/modelos";

const CLAVE_ALMACEN = "apolo-carrito";

function leerAlmacen(): ItemCarrito[] {
    try {
        const guardado = JSON.parse(localStorage.getItem(CLAVE_ALMACEN) ?? "[]");
        return Array.isArray(guardado) ? guardado : [];
    } catch {
        return [];
    }
}

@Injectable({ providedIn: "root" })
export class CarritoService {

    readonly items = signal<ItemCarrito[]>(leerAlmacen());

    readonly cantidadTotal = computed(() =>
        this.items().reduce((suma, item) => suma + item.cantidad, 0)
    );

    readonly total = computed(() =>
        this.items().reduce((suma, item) => suma + item.precio * item.cantidad, 0)
    );

    constructor() {
        effect(() => {
            try {
                localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(this.items()));
            } catch {
            }
        });
    }

    cantidadDe(productoId: string): number {
        return this.items().find(item => item.id === productoId)?.cantidad ?? 0;
    }

    agregar(producto: Producto): boolean {
        if (!producto.id) {
            return false;
        }

        const stock = Number(producto.stock);

        if (this.cantidadDe(producto.id) >= stock) {
            return false;
        }

        this.items.update(items => {
            const existente = items.find(item => item.id === producto.id);

            if (existente) {
                return items.map(item =>
                    item.id === producto.id ? { ...item, cantidad: item.cantidad + 1, stock } : item
                );
            }

            return [...items, {
                id: producto.id!,
                nombre: producto.nombre,
                precio: Number(producto.precio),
                imagen: producto.imagenPrincipal,
                stock,
                cantidad: 1
            }];
        });

        return true;
    }

    cambiarCantidad(productoId: string, cantidad: number) {
        if (cantidad <= 0) {
            this.quitar(productoId);
            return;
        }

        this.items.update(items => items.map(item =>
            item.id === productoId ? { ...item, cantidad: Math.min(cantidad, item.stock) } : item
        ));
    }

    quitar(productoId: string) {
        this.items.update(items => items.filter(item => item.id !== productoId));
    }

    vaciar() {
        this.items.set([]);
    }
}
