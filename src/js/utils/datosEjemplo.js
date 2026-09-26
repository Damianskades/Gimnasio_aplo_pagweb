function imagenDeEjemplo(texto) {
    return "https://placehold.co/600x600/0D0D0D/C9A227/png?text=" + encodeURIComponent(texto);
}

export const PRODUCTOS_EJEMPLO = [
    {
        nombre: "Proteína Whey 2 kg",
        marca: "Optimum Nutrition",
        categoria: "Suplementos",
        descripcion: "Proteína de suero de leche con 24 g de proteína por servicio. Ideal para después de entrenar.",
        precio: 189.9,
        precioAnterior: 229.9,
        imagenPrincipal: imagenDeEjemplo("Proteina Whey"),
        stock: 12,
        activo: true
    },
    {
        nombre: "Creatina monohidratada 300 g",
        marca: "Universal",
        categoria: "Suplementos",
        descripcion: "Creatina micronizada para ganar fuerza y volumen. Rinde 60 servicios.",
        precio: 99,
        imagenPrincipal: imagenDeEjemplo("Creatina"),
        stock: 8,
        activo: true
    },
    {
        nombre: "Pre-entreno C4 390 g",
        marca: "Cellucor",
        categoria: "Suplementos",
        descripcion: "Energía y concentración para entrenamientos intensos. Sabor frutos rojos.",
        precio: 149,
        precioAnterior: 179,
        imagenPrincipal: imagenDeEjemplo("Pre-entreno"),
        stock: 5,
        activo: true
    },
    {
        nombre: "Multivitamínico 90 cápsulas",
        marca: "GNC",
        categoria: "Suplementos",
        descripcion: "Complejo de vitaminas y minerales para el día a día del deportista.",
        precio: 79.5,
        imagenPrincipal: imagenDeEjemplo("Multivitaminico"),
        stock: 20,
        activo: true
    },
    {
        nombre: "Barras proteicas caja x12",
        marca: "Quest",
        categoria: "Snacks",
        descripcion: "Barras con 20 g de proteína y bajo contenido de azúcar. Sabor chocolate.",
        precio: 89,
        imagenPrincipal: imagenDeEjemplo("Barras"),
        stock: 18,
        activo: true
    },
    {
        nombre: "Shaker Apolo 600 ml",
        marca: "Apolo",
        categoria: "Accesorios",
        descripcion: "Vaso mezclador con rejilla antigrumos y marcas de medida. Libre de BPA.",
        precio: 25,
        imagenPrincipal: imagenDeEjemplo("Shaker"),
        stock: 0,
        activo: true
    },
    {
        nombre: "Guantes de entrenamiento",
        marca: "Apolo",
        categoria: "Accesorios",
        descripcion: "Guantes con refuerzo en la palma y muñequera ajustable. Tallas M y L.",
        precio: 45,
        imagenPrincipal: imagenDeEjemplo("Guantes"),
        stock: 15,
        activo: true
    },
    {
        nombre: "Cinturón de fuerza de cuero",
        marca: "Harbinger",
        categoria: "Accesorios",
        descripcion: "Cinturón de 10 cm para sentadilla y peso muerto. Protege la zona lumbar.",
        precio: 189,
        precioAnterior: 210,
        imagenPrincipal: imagenDeEjemplo("Cinturon"),
        stock: 0,
        activo: true
    },
    {
        nombre: "Polo Apolo edición 2026",
        marca: "Apolo",
        categoria: "Ropa",
        descripcion: "Polo de algodón con el logo bordado. Aún no está a la venta.",
        precio: 55,
        imagenPrincipal: imagenDeEjemplo("Polo Apolo"),
        stock: 40,
        activo: false
    }
];

export const PLANES_EJEMPLO = [
    {
        nombre: "DÍA LIBRE",
        precio: 15,
        beneficios: ["Acceso por 1 día", "Área de máquinas"],
        destacado: false,
        activo: true
    },
    {
        nombre: "MENSUAL BÁSICO",
        precio: 89,
        beneficios: ["Acceso libre", "Casillero"],
        destacado: false,
        activo: true
    },
    {
        nombre: "MENSUAL FULL",
        precio: 129,
        beneficios: ["Acceso libre", "Casillero", "Clases grupales", "Asesoría nutricional"],
        destacado: true,
        activo: true
    },
    {
        nombre: "TRIMESTRAL FULL",
        precio: 330,
        beneficios: ["Plan Full por 3 meses", "Ahorras S/ 57"],
        destacado: false,
        activo: true
    },
    {
        nombre: "ANUAL APOLO",
        precio: 1090,
        beneficios: ["Plan Full", "1 mes gratis", "Evaluación física trimestral"],
        destacado: false,
        activo: true
    }
];

export const HORARIOS_EJEMPLO = [
    {
        clase: "Funcional",
        dias: ["Lunes", "Miércoles", "Viernes"],
        horaInicio: "07:00",
        horaFin: "08:00",
        activo: true
    },
    {
        clase: "Funcional",
        dias: ["Lunes", "Miércoles", "Viernes"],
        horaInicio: "20:00",
        horaFin: "21:00",
        activo: true
    },
    {
        clase: "Spinning",
        dias: ["Martes", "Jueves"],
        horaInicio: "06:30",
        horaFin: "07:30",
        activo: true
    },
    {
        clase: "Spinning",
        dias: ["Martes", "Jueves"],
        horaInicio: "19:00",
        horaFin: "20:00",
        activo: true
    },
    {
        clase: "Box",
        dias: ["Lunes", "Miércoles", "Viernes"],
        horaInicio: "21:00",
        horaFin: "22:00",
        activo: true
    },
    {
        clase: "Yoga y estiramiento",
        dias: ["Sábado"],
        horaInicio: "09:00",
        horaFin: "10:00",
        activo: true
    }
];
