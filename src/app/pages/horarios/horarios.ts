import { Component, inject, OnInit, signal } from "@angular/core";

import { Cargando } from "../../components/cargando/cargando";
import { Tarjeta } from "../../components/tarjeta/tarjeta";
import { Horario, TarjetaInfo } from "../../models/modelos";
import { HorarioService } from "../../services/horario.service";
import { DIAS_SEMANA } from "../../utils/constantes";

type Estado = "cargando" | "listo" | "error";

function primerDia(horario: Horario): number {
    const indices = (Array.isArray(horario.dias) ? horario.dias : [])
        .map(dia => DIAS_SEMANA.indexOf(dia))
        .filter(indice => indice >= 0);

    return indices.length === 0 ? DIAS_SEMANA.length : Math.min(...indices);
}

function ordenarHorarios(horarios: Horario[]): Horario[] {
    return [...horarios].sort((uno, otro) => {
        const diferencia = primerDia(uno) - primerDia(otro);

        if (diferencia !== 0) {
            return diferencia;
        }

        return String(uno.horaInicio).localeCompare(String(otro.horaInicio));
    });
}

function formatoHora(hora: string): string {
    const partes = String(hora).split(":");
    const horas = Number(partes[0]);

    if (!Number.isFinite(horas)) {
        return String(hora);
    }

    const minutos = partes[1] === undefined ? "00" : partes[1];
    const sufijo = horas < 12 ? "a.m." : "p.m.";
    const horaDeReloj = horas % 12 === 0 ? 12 : horas % 12;

    return horaDeReloj + ":" + minutos + " " + sufijo;
}

function unirConY(partes: string[]): string {
    if (partes.length <= 1) {
        return partes.join("");
    }

    return partes.slice(0, -1).join(", ") + " y " + partes[partes.length - 1];
}

@Component({
    selector: "app-horarios",
    imports: [Cargando, Tarjeta],
    templateUrl: "./horarios.html",
    styleUrl: "./horarios.css"
})
export class Horarios implements OnInit {

    private readonly horarioService = inject(HorarioService);

    protected readonly horariosAtencion: TarjetaInfo[] = [
        { titulo: "LUNES A VIERNES", texto: "5:00 a.m. - 11:00 p.m." },
        { titulo: "SÁBADOS", texto: "6:00 a.m. - 9:00 p.m." },
        { titulo: "DOMINGOS Y FERIADOS", texto: "7:00 a.m. - 2:00 p.m." },
        { titulo: "MENOR CONCURRENCIA", texto: "10:00 a.m. - 4:00 p.m." }
    ];

    protected readonly reglas = [
        "Uso obligatorio de toalla.",
        "Limpiar el equipo después de usarlo.",
        "No reservar máquinas."
    ];

    protected readonly estado = signal<Estado>("cargando");
    protected readonly horarios = signal<Horario[]>([]);

    async ngOnInit() {
        try {
            const horarios = await this.horarioService.listarActivos();

            this.horarios.set(ordenarHorarios(horarios));
            this.estado.set("listo");
        } catch (fallo) {
            console.error(fallo);
            this.estado.set("error");
        }
    }

    protected dias(horario: Horario): string {
        return unirConY(Array.isArray(horario.dias) ? horario.dias : []);
    }

    protected horas(horario: Horario): string {
        return formatoHora(horario.horaInicio) + " - " + formatoHora(horario.horaFin);
    }
}
