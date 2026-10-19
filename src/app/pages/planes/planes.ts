import { Component, inject, OnInit, signal } from "@angular/core";
import { RouterLink } from "@angular/router";

import { Cargando } from "../../components/cargando/cargando";
import { Plan } from "../../models/modelos";
import { PlanService } from "../../services/plan.service";
import { MonedaPipe } from "../../utils/moneda.pipe";

type Estado = "cargando" | "listo" | "error";

@Component({
    selector: "app-planes",
    imports: [RouterLink, Cargando, MonedaPipe],
    templateUrl: "./planes.html",
    styleUrl: "./planes.css"
})
export class Planes implements OnInit {

    private readonly planService = inject(PlanService);

    protected readonly estado = signal<Estado>("cargando");
    protected readonly planes = signal<Plan[]>([]);

    async ngOnInit() {
        try {
            const planes = await this.planService.listarActivos();

            this.planes.set([...planes].sort((uno, otro) => Number(uno.precio) - Number(otro.precio)));
            this.estado.set("listo");
        } catch (fallo) {
            console.error(fallo);
            this.estado.set("error");
        }
    }

    protected beneficios(plan: Plan): string[] {
        return Array.isArray(plan.beneficios) ? plan.beneficios : [];
    }
}
