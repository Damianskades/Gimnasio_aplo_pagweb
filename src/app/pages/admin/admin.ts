import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { RouterLink } from "@angular/router";

import { ServicioCrud } from "../../models/modelos";
import { ProductoService } from "../../services/producto.service";
import { PlanService } from "../../services/plan.service";
import { HorarioService } from "../../services/horario.service";
import { PedidoService } from "../../services/pedido.service";
import { UsuarioService } from "../../services/usuario.service";
import { DIAS_SEMANA, ESTADOS_PEDIDO } from "../../utils/constantes";
import { PRODUCTOS_EJEMPLO, PLANES_EJEMPLO, HORARIOS_EJEMPLO } from "../../utils/datos-ejemplo";

type TipoCampo = "texto" | "numero" | "enlace" | "hora" | "lista" | "casilla" | "casillas" | "opciones" | "detalle" | "fecha";
type Clave = "productos" | "planes" | "horarios" | "pedidos" | "usuarios";
type Registro = Record<string, unknown> & { id?: string };
type Valor = string | boolean | string[];

interface Campo {
    nombre: string;
    etiqueta: string;
    tipo: TipoCampo;
    obligatorio?: boolean;
    ancho?: boolean;
    porDefecto?: boolean;
    opciones?: string[];
    soloLectura?: boolean;
}

interface Coleccion {
    titulo: string;
    tituloNuevo: string;
    tituloEditar: string;
    service: ServicioCrud<Registro>;
    ejemplos: object[];
    campos: Campo[];
    soloEdicion?: boolean;
    soloConsulta?: boolean;
    campoOrden?: string;
    descendente?: boolean;
}

interface Mensaje {
    texto: string;
    tipo: "exito" | "error";
}

const tiposHtml: Partial<Record<TipoCampo, string>> = {
    texto: "text",
    numero: "number",
    enlace: "url",
    hora: "time"
};

@Component({
    selector: "app-admin",
    imports: [RouterLink],
    templateUrl: "./admin.html",
    styleUrl: "./admin.css"
})
export class Admin implements OnInit {

    protected readonly colecciones: Record<Clave, Coleccion> = {
        productos: {
            titulo: "Productos",
            tituloNuevo: "Nuevo producto",
            tituloEditar: "Editar producto",
            service: inject(ProductoService) as unknown as ServicioCrud<Registro>,
            ejemplos: PRODUCTOS_EJEMPLO,
            campos: [
                { nombre: "nombre", etiqueta: "Nombre", tipo: "texto", obligatorio: true },
                { nombre: "categoria", etiqueta: "Categoría", tipo: "texto", obligatorio: true },
                { nombre: "precio", etiqueta: "Precio", tipo: "numero", obligatorio: true },
                { nombre: "stock", etiqueta: "Stock", tipo: "numero", obligatorio: true },
                { nombre: "imagenPrincipal", etiqueta: "Imagen principal (URL)", tipo: "enlace", obligatorio: true, ancho: true },
                { nombre: "activo", etiqueta: "Visible en el sitio", tipo: "casilla", porDefecto: true }
            ]
        },
        planes: {
            titulo: "Suscripciones",
            tituloNuevo: "Nueva suscripción",
            tituloEditar: "Editar suscripción",
            service: inject(PlanService) as unknown as ServicioCrud<Registro>,
            ejemplos: PLANES_EJEMPLO,
            campos: [
                { nombre: "nombre", etiqueta: "Nombre", tipo: "texto", obligatorio: true },
                { nombre: "precio", etiqueta: "Precio", tipo: "numero", obligatorio: true },
                { nombre: "beneficios", etiqueta: "Beneficios (uno por línea)", tipo: "lista", obligatorio: true, ancho: true },
                { nombre: "activo", etiqueta: "Visible en el sitio", tipo: "casilla", porDefecto: true }
            ]
        },
        horarios: {
            titulo: "Horarios",
            tituloNuevo: "Nuevo horario",
            tituloEditar: "Editar horario",
            service: inject(HorarioService) as unknown as ServicioCrud<Registro>,
            ejemplos: HORARIOS_EJEMPLO,
            campos: [
                { nombre: "clase", etiqueta: "Clase", tipo: "texto", obligatorio: true, ancho: true },
                { nombre: "dias", etiqueta: "Días", tipo: "casillas", opciones: DIAS_SEMANA, obligatorio: true, ancho: true },
                { nombre: "horaInicio", etiqueta: "Hora de inicio", tipo: "hora", obligatorio: true },
                { nombre: "horaFin", etiqueta: "Hora de fin", tipo: "hora", obligatorio: true },
                { nombre: "activo", etiqueta: "Visible en el sitio", tipo: "casilla", porDefecto: true }
            ]
        },
        pedidos: {
            titulo: "Pedidos",
            tituloNuevo: "Pedido",
            tituloEditar: "Actualizar pedido",
            service: inject(PedidoService) as unknown as ServicioCrud<Registro>,
            ejemplos: [],
            soloEdicion: true,
            campoOrden: "fecha",
            descendente: true,
            campos: [
                { nombre: "nombreCliente", etiqueta: "Cliente", tipo: "texto", soloLectura: true },
                { nombre: "correo", etiqueta: "Correo", tipo: "texto", soloLectura: true },
                { nombre: "items", etiqueta: "Productos", tipo: "detalle", soloLectura: true, ancho: true },
                { nombre: "total", etiqueta: "Total", tipo: "numero", soloLectura: true },
                { nombre: "fecha", etiqueta: "Fecha", tipo: "fecha", soloLectura: true },
                { nombre: "estado", etiqueta: "Estado", tipo: "opciones", opciones: ESTADOS_PEDIDO, obligatorio: true }
            ]
        },
        usuarios: {
            titulo: "Usuarios",
            tituloNuevo: "Usuario",
            tituloEditar: "Usuario",
            service: inject(UsuarioService) as unknown as ServicioCrud<Registro>,
            ejemplos: [],
            soloConsulta: true,
            campoOrden: "fechaRegistro",
            descendente: true,
            campos: [
                { nombre: "nombre", etiqueta: "Nombre", tipo: "texto", soloLectura: true },
                { nombre: "correo", etiqueta: "Correo", tipo: "texto", soloLectura: true },
                { nombre: "fechaRegistro", etiqueta: "Fecha de registro", tipo: "fecha", soloLectura: true },
                { nombre: "ultimoIngreso", etiqueta: "Último ingreso", tipo: "fecha", soloLectura: true }
            ]
        }
    };

    protected readonly claves = Object.keys(this.colecciones) as Clave[];

    protected readonly claveActiva = signal<Clave>("productos");
    protected readonly idEnEdicion = signal<string | null>(null);
    protected readonly registros = signal<Registro[]>([]);
    protected readonly cargando = signal(true);
    protected readonly mensaje = signal<Mensaje | null>(null);
    protected readonly modelo = signal<Record<string, Valor>>({});

    protected readonly registroEnEdicion = computed(() =>
        this.registros().find(registro => registro.id === this.idEnEdicion()) ?? null
    );

    ngOnInit() {
        this.refrescar();
    }

    protected get definicion(): Coleccion {
        return this.colecciones[this.claveActiva()];
    }

    protected mostrarFormulario(): boolean {
        const definicion = this.definicion;

        if (definicion.soloConsulta) {
            return false;
        }

        return !definicion.soloEdicion || this.idEnEdicion() !== null;
    }

    protected mostrarPestana(clave: Clave) {
        this.claveActiva.set(clave);
        this.idEnEdicion.set(null);
        this.refrescar();
    }

    private async refrescar(mensaje: Mensaje | null = null) {
        const definicion = this.definicion;
        this.cargando.set(true);

        let registros: Registro[] = [];

        try {
            registros = await definicion.service.listar();
        } catch (fallo) {
            console.error(fallo);
            mensaje = { texto: "No se pudo leer la base de datos. Revisa tu conexión a internet.", tipo: "error" };
        }

        const registro = registros.find(fila => fila.id === this.idEnEdicion()) ?? null;

        if (!registro) {
            this.idEnEdicion.set(null);
        }

        this.registros.set(this.ordenar(definicion, registros));
        this.modelo.set(this.crearModelo(definicion, registro));
        this.mensaje.set(mensaje);
        this.cargando.set(false);
    }

    private ordenar(definicion: Coleccion, registros: Registro[]): Registro[] {
        const campo = definicion.campoOrden ?? definicion.campos[0].nombre;
        const direccion = definicion.descendente ? -1 : 1;

        return [...registros].sort((uno, otro) => {
            const valorUno = uno[campo];
            const valorOtro = otro[campo];

            if (this.esFecha(valorUno) || this.esFecha(valorOtro)) {
                return direccion * (this.milisegundos(valorUno) - this.milisegundos(valorOtro));
            }

            return direccion * String(valorUno ?? "").localeCompare(String(valorOtro ?? ""), "es");
        });
    }

    private esFecha(valor: unknown): valor is { toDate(): Date } {
        return typeof (valor as { toDate?: unknown })?.toDate === "function";
    }

    private milisegundos(valor: unknown): number {
        return this.esFecha(valor) ? valor.toDate().getTime() : 0;
    }

    private crearModelo(definicion: Coleccion, registro: Registro | null): Record<string, Valor> {
        const modelo: Record<string, Valor> = {};

        for (const campo of definicion.campos.filter(campo => !campo.soloLectura)) {
            const valor = registro ? registro[campo.nombre] : undefined;

            if (campo.tipo === "opciones") {
                modelo[campo.nombre] = String(valor ?? campo.opciones?.[0] ?? "");
            } else if (campo.tipo === "casilla") {
                modelo[campo.nombre] = registro ? Boolean(valor) : Boolean(campo.porDefecto);
            } else if (campo.tipo === "casillas") {
                modelo[campo.nombre] = Array.isArray(valor) ? [...valor] : [];
            } else if (campo.tipo === "lista") {
                modelo[campo.nombre] = Array.isArray(valor) ? valor.join("\n") : "";
            } else {
                modelo[campo.nombre] = valor === null || valor === undefined ? "" : String(valor);
            }
        }

        return modelo;
    }

    protected tipoHtml(campo: Campo): string {
        return tiposHtml[campo.tipo] ?? "text";
    }

    protected texto(campo: Campo): string {
        return String(this.modelo()[campo.nombre] ?? "");
    }

    protected marcada(campo: Campo): boolean {
        return Boolean(this.modelo()[campo.nombre]);
    }

    protected opcionMarcada(campo: Campo, opcion: string): boolean {
        const valor = this.modelo()[campo.nombre];
        return Array.isArray(valor) && valor.includes(opcion);
    }

    protected filas(campo: Campo): number {
        return Math.max(4, this.texto(campo).split("\n").length + 1);
    }

    protected cambiarTexto(campo: Campo, evento: Event) {
        const valor = (evento.target as HTMLInputElement).value;
        this.modelo.update(modelo => ({ ...modelo, [campo.nombre]: valor }));
    }

    protected cambiarCasilla(campo: Campo, evento: Event) {
        const marcada = (evento.target as HTMLInputElement).checked;
        this.modelo.update(modelo => ({ ...modelo, [campo.nombre]: marcada }));
    }

    protected cambiarOpcion(campo: Campo, opcion: string, evento: Event) {
        const marcada = (evento.target as HTMLInputElement).checked;
        const opciones = campo.opciones ?? [];

        this.modelo.update(modelo => {
            const actuales = Array.isArray(modelo[campo.nombre]) ? modelo[campo.nombre] as string[] : [];
            const nuevas = marcada
                ? [...actuales, opcion]
                : actuales.filter(actual => actual !== opcion);

            return { ...modelo, [campo.nombre]: opciones.filter(dia => nuevas.includes(dia)) };
        });
    }

    private leerFormulario(definicion: Coleccion): Record<string, Valor> {
        const datos: Record<string, Valor> = {};

        for (const campo of definicion.campos.filter(campo => !campo.soloLectura)) {
            const valor = this.modelo()[campo.nombre];
            datos[campo.nombre] = typeof valor === "string" ? valor.trim() : valor;
        }

        return datos;
    }

    private validar(definicion: Coleccion, datos: Record<string, Valor>): string {
        const editables = definicion.campos.filter(campo => !campo.soloLectura);

        const faltantes = editables
            .filter(campo => {
                const valor = datos[campo.nombre];
                const vacio = Array.isArray(valor) ? valor.length === 0 : valor === "";
                return campo.obligatorio && vacio;
            })
            .map(campo => campo.etiqueta);

        if (faltantes.length > 0) {
            return "Falta completar: " + faltantes.join(", ") + ".";
        }

        const invalidos = editables
            .filter(campo => campo.tipo === "numero" && datos[campo.nombre] !== "")
            .filter(campo => {
                const numero = Number(datos[campo.nombre]);
                return !Number.isFinite(numero) || numero < 0;
            })
            .map(campo => campo.etiqueta);

        if (invalidos.length > 0) {
            return "Debe ser un número mayor o igual a cero: " + invalidos.join(", ") + ".";
        }

        return "";
    }

    protected async guardar(evento: Event) {
        evento.preventDefault();

        const definicion = this.definicion;
        const datos = this.leerFormulario(definicion);
        const error = this.validar(definicion, datos);

        if (error) {
            this.mensaje.set({ texto: error, tipo: "error" });
            return;
        }

        try {
            const id = this.idEnEdicion();

            if (id) {
                await definicion.service.actualizar(id, datos);
                this.idEnEdicion.set(null);
                await this.refrescar({ texto: "Se actualizó el registro correctamente.", tipo: "exito" });
            } else {
                await definicion.service.crear(datos);
                await this.refrescar({ texto: "Se guardó el registro correctamente.", tipo: "exito" });
            }
        } catch (fallo) {
            console.error(fallo);
            this.mensaje.set({ texto: "No se pudo guardar. Revisa tu conexión a internet.", tipo: "error" });
        }
    }

    protected editar(registro: Registro) {
        this.idEnEdicion.set(registro.id ?? null);
        this.modelo.set(this.crearModelo(this.definicion, registro));
        this.mensaje.set({ texto: "Estás editando un registro. Cambia lo que necesites y pulsa Actualizar.", tipo: "exito" });
        setTimeout(() => document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }

    protected cancelar() {
        this.idEnEdicion.set(null);
        this.modelo.set(this.crearModelo(this.definicion, null));
        this.mensaje.set(null);
    }

    protected async eliminar(registro: Registro) {
        const confirmado = window.confirm("¿Seguro que quieres eliminar este registro? Esta acción no se puede deshacer.");

        if (!confirmado || !registro.id) {
            return;
        }

        try {
            await this.definicion.service.eliminar(registro.id);

            if (this.idEnEdicion() === registro.id) {
                this.idEnEdicion.set(null);
            }

            await this.refrescar({ texto: "Se eliminó el registro.", tipo: "exito" });
        } catch (fallo) {
            console.error(fallo);
            this.mensaje.set({ texto: "No se pudo eliminar. Revisa tu conexión a internet.", tipo: "error" });
        }
    }

    protected async sembrar() {
        const definicion = this.definicion;
        const cantidad = definicion.ejemplos.length;
        const confirmado = window.confirm("Se van a crear " + cantidad + " registros de ejemplo en " + definicion.titulo + ". ¿Continuar?");

        if (!confirmado) {
            return;
        }

        try {
            for (const ejemplo of definicion.ejemplos) {
                await definicion.service.crear(ejemplo);
            }

            await this.refrescar({ texto: "Se cargaron " + cantidad + " registros de ejemplo.", tipo: "exito" });
        } catch (fallo) {
            console.error(fallo);
            await this.refrescar({ texto: "No se pudieron cargar todos los datos de ejemplo. Revisa tu conexión a internet.", tipo: "error" });
        }
    }

    protected textoOpcion(opcion: string): string {
        return opcion.charAt(0).toUpperCase() + opcion.slice(1);
    }

    protected textoDeCelda(campo: Campo, registro: Registro | null): string {
        const valor = registro ? registro[campo.nombre] : undefined;

        if (campo.tipo === "opciones") {
            return valor ? this.textoOpcion(String(valor)) : "-";
        }

        if (campo.tipo === "fecha") {
            return this.esFecha(valor) ? valor.toDate().toLocaleString("es-PE") : "-";
        }

        if (campo.tipo === "detalle") {
            const items = Array.isArray(valor) ? valor as { nombre: string; cantidad: number }[] : [];
            return items.length > 0 ? items.map(item => item.cantidad + " x " + item.nombre).join(", ") : "-";
        }

        if (campo.tipo === "casilla") {
            return valor ? "Sí" : "No";
        }

        if (campo.tipo === "lista") {
            return Array.isArray(valor) ? valor.join(" - ") : "-";
        }

        if (campo.tipo === "casillas") {
            return Array.isArray(valor) && valor.length > 0 ? valor.join(", ") : "-";
        }

        if (valor === null || valor === undefined || valor === "") {
            return "-";
        }

        const texto = String(valor);
        return texto.length > 60 && !campo.soloLectura ? texto.slice(0, 60) + "..." : texto;
    }
}
