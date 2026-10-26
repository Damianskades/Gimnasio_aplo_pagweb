import { Component, inject, OnInit, signal } from "@angular/core";
import { RouterLink } from "@angular/router";

import { Cargando } from "../../components/cargando/cargando";
import { Pedido } from "../../models/modelos";
import { AuthService } from "../../services/auth.service";
import { PedidoService } from "../../services/pedido.service";
import { MonedaPipe } from "../../utils/moneda.pipe";

type Estado = "cargando" | "listo" | "error";

const textosDeEstado: Record<Pedido["estado"], string> = {
    pendiente: "Pendiente",
    entregado: "Entregado",
    cancelado: "Cancelado"
};

@Component({
    selector: "app-mis-pedidos",
    imports: [RouterLink, Cargando, MonedaPipe],
    templateUrl: "./mis-pedidos.html",
    styleUrl: "./mis-pedidos.css"
})
export class MisPedidos implements OnInit {

    private readonly auth = inject(AuthService);
    private readonly pedidoService = inject(PedidoService);

    protected readonly estado = signal<Estado>("cargando");
    protected readonly pedidos = signal<Pedido[]>([]);

    async ngOnInit() {
        const usuario = this.auth.usuario();

        if (!usuario) {
            this.estado.set("error");
            return;
        }

        try {
            this.pedidos.set(await this.pedidoService.listarDeUsuario(usuario.uid));
            this.estado.set("listo");
        } catch (fallo) {
            console.error(fallo);
            this.estado.set("error");
        }
    }

    protected fecha(pedido: Pedido): string {
        return pedido.fecha ? pedido.fecha.toDate().toLocaleString("es-PE") : "-";
    }

    protected textoEstado(pedido: Pedido): string {
        return textosDeEstado[pedido.estado] ?? textosDeEstado.pendiente;
    }
}
