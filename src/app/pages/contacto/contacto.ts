import { Component, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

import { Tarjeta } from "../../components/tarjeta/tarjeta";
import { Plan, TarjetaInfo } from "../../models/modelos";
import { PlanService } from "../../services/plan.service";
import { MonedaPipe } from "../../utils/moneda.pipe";

@Component({
    selector: "app-contacto",
    imports: [ReactiveFormsModule, Tarjeta, MonedaPipe],
    templateUrl: "./contacto.html",
    styleUrl: "./contacto.css"
})
export class Contacto implements OnInit {

    private readonly fb = inject(FormBuilder);
    private readonly planService = inject(PlanService);
    private readonly moneda = new MonedaPipe();

    protected readonly planes = signal<Plan[]>([]);
    protected readonly cargandoPlanes = signal(true);

    protected readonly datosContacto: TarjetaInfo[] = [
        { titulo: "DIRECCIÓN", texto: "Vista Alegre, Tarma, Junin" },
        { titulo: "TELÉFONO", texto: "945 231 423" },
        { titulo: "WHATSAPP", texto: "987 654 321" },
        { titulo: "CORREO", texto: "serviciosg@gimnasioapolo.pe" }
    ];

    protected readonly formulario = this.fb.nonNullable.group({
        nombre: ["", Validators.required],
        apellido: ["", Validators.required],
        correo: ["", [Validators.required, Validators.email]],
        plan: ["", Validators.required]
    });

    protected readonly mensaje = signal<{ texto: string; tipo: "exito" | "error" } | null>(null);

    async ngOnInit() {
        try {
            const planes = await this.planService.listarActivos();
            const ordenados = [...planes].sort((uno, otro) => Number(uno.precio) - Number(otro.precio));

            this.planes.set(ordenados);

            if (ordenados.length > 0) {
                this.formulario.controls.plan.setValue(ordenados[0].id ?? "");
            }
        } catch (fallo) {
            console.error(fallo);
            this.mensaje.set({ texto: "No pudimos cargar los planes. Revisa tu conexión a internet.", tipo: "error" });
        } finally {
            this.cargandoPlanes.set(false);
        }
    }

    protected invalido(campo: "nombre" | "apellido" | "correo" | "plan"): boolean {
        const control = this.formulario.controls[campo];
        return control.invalid && control.touched;
    }

    registrar() {
        if (this.formulario.invalid) {
            this.formulario.markAllAsTouched();
            this.mensaje.set({ texto: "Debes completar todos los campos correctamente.", tipo: "error" });
            return;
        }

        const { nombre, apellido, correo, plan } = this.formulario.getRawValue();
        const planElegido = this.planes().find(opcion => opcion.id === plan);

        if (!planElegido) {
            this.mensaje.set({ texto: "Elige un plan de la lista.", tipo: "error" });
            return;
        }

        this.mensaje.set({
            texto: "Hola " + nombre + " " + apellido + ", tu inscripción al plan " + planElegido.nombre +
                " por " + this.moneda.transform(planElegido.precio) + " fue registrada. Te escribiremos a " + correo + ".",
            tipo: "exito"
        });
    }
}
