import { Injectable } from "@angular/core";
import { collection, doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { User } from "firebase/auth";

import { Datos, FirestoreCrud } from "./firestore-crud";
import { db } from "../core/firestore";
import { ItemCarrito, Pedido } from "../models/modelos";
import { COLECCION_PEDIDOS, COLECCION_PRODUCTOS, ESTADOS_PEDIDO } from "../utils/constantes";

export class ErrorDePedido extends Error { }

@Injectable({ providedIn: "root" })
export class PedidoService extends FirestoreCrud<Pedido> {

    protected readonly coleccion = COLECCION_PEDIDOS;

    protected preparar(datos: Datos): Datos {
        const estado = String(datos["estado"]);

        return {
            estado: ESTADOS_PEDIDO.includes(estado) ? estado : ESTADOS_PEDIDO[0]
        };
    }

    async registrar(usuario: User, items: ItemCarrito[]): Promise<string> {
        const referenciaPedido = doc(collection(db, COLECCION_PEDIDOS));

        await runTransaction(db, async transaccion => {
            const referencias = items.map(item => doc(db, COLECCION_PRODUCTOS, item.id));
            const documentos = await Promise.all(referencias.map(referencia => transaccion.get(referencia)));

            documentos.forEach((documento, indice) => {
                const item = items[indice];

                if (!documento.exists() || documento.data()["activo"] === false) {
                    throw new ErrorDePedido(item.nombre + " ya no está disponible. Quítalo del carrito.");
                }

                const stock = Number(documento.data()["stock"]);

                if (stock < item.cantidad) {
                    throw new ErrorDePedido(
                        "Solo quedan " + stock + " unidades de " + item.nombre + ". Ajusta la cantidad."
                    );
                }
            });

            documentos.forEach((documento, indice) => {
                const stock = Number(documento.data()!["stock"]);
                transaccion.update(referencias[indice], { stock: stock - items[indice].cantidad });
            });

            const pedido: Pedido = {
                usuarioId: usuario.uid,
                correo: usuario.email ?? "",
                nombreCliente: usuario.displayName ?? "",
                items: items.map(item => ({
                    productoId: item.id,
                    nombre: item.nombre,
                    precio: item.precio,
                    cantidad: item.cantidad
                })),
                total: items.reduce((suma, item) => suma + item.precio * item.cantidad, 0),
                estado: "pendiente"
            };

            transaccion.set(referenciaPedido, { ...pedido, fecha: serverTimestamp() });
        });

        return referenciaPedido.id;
    }
}
