import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { AuthService, mensajeDeError } from "../../services/auth.service";

type Modo = "ingresar" | "registrar";

@Component({
    selector: "app-login",
    imports: [ReactiveFormsModule],
    templateUrl: "./login.html",
    styleUrl: "./login.css"
})
export class Login {

    private readonly auth = inject(AuthService);
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly ruta = inject(ActivatedRoute);

    protected readonly modo = signal<Modo>("ingresar");
    protected readonly enviando = signal(false);
    protected readonly error = signal("");

    private readonly volver: string = this.ruta.snapshot.queryParamMap.get("volver") ?? "/";

    protected readonly formulario = this.fb.nonNullable.group({
        nombre: [""],
        correo: ["", [Validators.required, Validators.email]],
        contrasena: ["", [Validators.required, Validators.minLength(6)]]
    });

    protected cambiarModo(modo: Modo) {
        this.modo.set(modo);
        this.error.set("");

        const nombre = this.formulario.controls.nombre;
        nombre.setValidators(modo === "registrar" ? [Validators.required] : []);
        nombre.updateValueAndValidity();
        this.formulario.markAsUntouched();
    }

    protected invalido(campo: "nombre" | "correo" | "contrasena"): boolean {
        const control = this.formulario.controls[campo];
        return control.invalid && control.touched;
    }

    protected async enviar() {
        this.error.set("");

        if (this.formulario.invalid) {
            this.formulario.markAllAsTouched();
            return;
        }

        const { nombre, correo, contrasena } = this.formulario.getRawValue();
        this.enviando.set(true);

        try {
            if (this.modo() === "registrar") {
                await this.auth.registrar(nombre.trim(), correo, contrasena);
            } else {
                await this.auth.ingresar(correo, contrasena);
            }

            this.router.navigateByUrl(this.volver);
        } catch (fallo) {
            console.error(fallo);
            this.error.set(mensajeDeError(fallo));
        } finally {
            this.enviando.set(false);
        }
    }
}
