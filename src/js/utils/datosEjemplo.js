function imagenDeEjemplo(texto) {
    return "https://placehold.co/600x600/0D0D0D/C9A227/png?text=" + encodeURIComponent(texto);
}

export const PRODUCTOS_EJEMPLO = [
    {
        nombre: "Proteína Whey 2 kg",
        categoria: "Suplementos",
        precio: 189.9,
        stock: 12,
        imagenPrincipal: imagenDeEjemplo("Proteina Whey"),
        activo: true
    },
    {
        nombre: "Creatina monohidratada 300 g",
        categoria: "Suplementos",
        precio: 99,
        stock: 8,
        imagenPrincipal: imagenDeEjemplo("Creatina"),
        activo: true
    },
    {
        nombre: "Pre-entreno C4 390 g",
        categoria: "Suplementos",
        precio: 149,
        stock: 5,
        imagenPrincipal: imagenDeEjemplo("Pre-entreno"),
        activo: true
    },
    {
        nombre: "Multivitamínico 90 cápsulas",
        categoria: "Suplementos",
        precio: 79.5,
        stock: 20,
        imagenPrincipal: imagenDeEjemplo("Multivitaminico"),
        activo: true
    },
    {
        nombre: "Barras proteicas caja x12",
        categoria: "Snacks",
        precio: 89,
        stock: 18,
        imagenPrincipal: imagenDeEjemplo("Barras"),
        activo: true
    },
    {
        nombre: "Shaker Apolo 600 ml",
        categoria: "Accesorios",
        precio: 25,
        stock: 0,
        imagenPrincipal: imagenDeEjemplo("Shaker"),
        activo: true
    },
    {
        nombre: "Guantes de entrenamiento",
        categoria: "Accesorios",
        precio: 45,
        stock: 15,
        imagenPrincipal: imagenDeEjemplo("Guantes"),
        activo: true
    },
    {
        nombre: "Cinturón de fuerza de cuero",
        categoria: "Accesorios",
        precio: 189,
        stock: 0,
        imagenPrincipal: imagenDeEjemplo("Cinturon"),
        activo: true
    },
    {
        nombre: "Polo Apolo edición 2026",
        categoria: "Ropa",
        precio: 55,
        stock: 40,
        imagenPrincipal: imagenDeEjemplo("Polo Apolo"),
        activo: false
    }
];

export const PLANES_EJEMPLO = [
    {
        nombre: "DÍA LIBRE",
        precio: 15,
        beneficios: ["Acceso por 1 día", "Área de máquinas"],
        activo: true
    },
    {
        nombre: "MENSUAL BÁSICO",
        precio: 89,
        beneficios: ["Acceso libre", "Casillero"],
        activo: true
    },
    {
        nombre: "MENSUAL FULL",
        precio: 129,
        beneficios: ["Acceso libre", "Casillero", "Clases grupales", "Asesoría nutricional"],
        activo: true
    },
    {
        nombre: "TRIMESTRAL FULL",
        precio: 330,
        beneficios: ["Plan Full por 3 meses", "Ahorras S/ 57"],
        activo: true
    },
    {
        nombre: "ANUAL APOLO",
        precio: 1090,
        beneficios: ["Plan Full", "1 mes gratis", "Evaluación física trimestral"],
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
