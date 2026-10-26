import { computed, Injectable, signal } from "@angular/core";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User
} from "firebase/auth";

import { auth } from "../core/auth";

const mensajesDeError: Record<string, string> = {
    "auth/invalid-credential": "El correo o la contraseña no son correctos.",
    "auth/invalid-email": "El correo no tiene un formato válido.",
    "auth/user-disabled": "Esta cuenta fue desactivada. Consúltanos en recepción.",
    "auth/email-already-in-use": "Ya existe una cuenta con ese correo. Inicia sesión.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/too-many-requests": "Demasiados intentos. Espera unos minutos y vuelve a probar.",
    "auth/network-request-failed": "No hay conexión a internet. Revisa tu red e intenta de nuevo.",
    "auth/operation-not-allowed": "El inicio de sesión con correo no está habilitado en Firebase."
};

export class ErrorDeAcceso extends Error { }

export function mensajeDeError(fallo: unknown): string {
    if (fallo instanceof ErrorDeAcceso) {
        return fallo.message;
    }

    const codigo = (fallo as { code?: string })?.code ?? "";
    return mensajesDeError[codigo] ?? "Ocurrió un error inesperado. Intenta de nuevo.";
}

async function tieneRolAdmin(uid: string): Promise<boolean> {
    try {
        const { leerRol } = await import("./usuario.service");
        return await leerRol(uid) === "admin";
    } catch (fallo) {
        console.error(fallo);
        return false;
    }
}

@Injectable({ providedIn: "root" })
export class AuthService {

    readonly usuario = signal<User | null>(null);

    readonly listo = signal(false);

    readonly esAdmin = signal(false);

    private rolResuelto: Promise<void> = Promise.resolve();

    readonly conectado = computed(() => this.usuario() !== null);

    readonly nombre = computed(() => {
        const usuario = this.usuario();

        if (!usuario) {
            return "";
        }

        return usuario.displayName || usuario.email?.split("@")[0] || "Socio";
    });

    constructor() {
        onAuthStateChanged(auth, usuario => {
            this.rolResuelto = this.resolverRol(usuario);
        });
    }

    async ingresar(correo: string, contrasena: string) {
        const credencial = await signInWithEmailAndPassword(auth, correo, contrasena);
        await this.guardarUsuario(credencial.user, false);
        await this.rolResuelto;
    }

    async ingresarAdmin(correo: string, contrasena: string) {
        const credencial = await signInWithEmailAndPassword(auth, correo, contrasena);

        if (!await tieneRolAdmin(credencial.user.uid)) {
            await signOut(auth);
            throw new ErrorDeAcceso("Esta cuenta no tiene permisos de administrador.");
        }

        await this.guardarUsuario(credencial.user, false);
        await this.rolResuelto;
    }

    async registrar(nombre: string, correo: string, contrasena: string) {
        const credencial = await createUserWithEmailAndPassword(auth, correo, contrasena);
        await updateProfile(credencial.user, { displayName: nombre });

        this.usuario.set(null);
        this.usuario.set(auth.currentUser);

        await this.guardarUsuario(credencial.user, true);
    }

    async salir() {
        await signOut(auth);
    }

    private async resolverRol(usuario: User | null) {
        const esAdmin = usuario ? await tieneRolAdmin(usuario.uid) : false;

        if (auth.currentUser?.uid !== usuario?.uid) {
            return;
        }

        this.esAdmin.set(esAdmin);
        this.usuario.set(usuario);
        this.listo.set(true);
    }

    private async guardarUsuario(usuario: User, nuevo: boolean) {
        try {
            const { registrarUsuario } = await import("./usuario.service");
            await registrarUsuario(usuario, nuevo);
        } catch (fallo) {
            console.error(fallo);
        }
    }
}
