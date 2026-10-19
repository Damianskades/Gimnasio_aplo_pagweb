import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

import { Tarjeta } from "../../components/tarjeta/tarjeta";
import { TarjetaInfo } from "../../models/modelos";

@Component({
    selector: "app-inicio",
    imports: [RouterLink, Tarjeta],
    templateUrl: "./inicio.html",
    styleUrl: "./inicio.css"
})
export class Inicio {

    protected readonly servicios: TarjetaInfo[] = [
        {
            titulo: "SALA DE PESAS",
            texto: "Máquinas y peso libre para todos los niveles.",
            imagen: "img/pesas.jpg",
            textoAlternativo: "Sala de pesas del gimnasio"
        },
        {
            titulo: "ZONA CARDIO",
            texto: "Trotadoras, elípticas y bicicletas estáticas.",
            imagen: "img/cardio.jpeg",
            textoAlternativo: "Zona cardio con trotadoras"
        },
        {
            titulo: "ÁREA FUNCIONAL",
            texto: "Espacio abierto para entrenamiento funcional.",
            imagen: "img/funcional.jpg",
            textoAlternativo: "Área funcional con implementos"
        },
        {
            titulo: "DUCHAS Y VESTIDORES",
            texto: "Vestidores amplios con casilleros y duchas.",
            imagen: "img/duchas.jpg",
            textoAlternativo: "Duchas y vestidores"
        },
        {
            titulo: "ESTACIONAMIENTO",
            texto: "Estacionamiento gratuito para socios.",
            imagen: "img/estacionamiento.png",
            textoAlternativo: "Estacionamiento del gimnasio"
        },
        {
            titulo: "TIENDA DE SUPLEMENTOS",
            texto: "Proteínas y suplementos de marcas originales.",
            imagen: "img/tienda.jpg",
            textoAlternativo: "Tienda de suplementos"
        }
    ];
}
