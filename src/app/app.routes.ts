import { Routes } from "@angular/router";
import { SitioLayout } from "./layout/sitio-layout";

export const routes: Routes = [
    {
        path: "admin",
        title: "Panel de administración - Gimnasio Apolo",
        loadComponent: () => import("./pages/admin/admin").then(m => m.Admin)
    },
    {
        path: "login",
        title: "Iniciar sesión - Gimnasio Apolo",
        loadComponent: () => import("./pages/login/login").then(m => m.Login)
    },
    {
        path: "",
        component: SitioLayout,
        children: [
            {
                path: "",
                title: "Gimnasio Apolo",
                loadComponent: () => import("./pages/inicio/inicio").then(m => m.Inicio)
            },
            {
                path: "productos",
                title: "Productos - Gimnasio Apolo",
                loadComponent: () => import("./pages/productos/productos").then(m => m.Productos)
            },
            {
                path: "planes",
                title: "Planes - Gimnasio Apolo",
                loadComponent: () => import("./pages/planes/planes").then(m => m.Planes)
            },
            {
                path: "horarios",
                title: "Horarios - Gimnasio Apolo",
                loadComponent: () => import("./pages/horarios/horarios").then(m => m.Horarios)
            },
            {
                path: "contacto",
                title: "Contacto - Gimnasio Apolo",
                loadComponent: () => import("./pages/contacto/contacto").then(m => m.Contacto)
            },
            {
                path: "carrito",
                title: "Carrito - Gimnasio Apolo",
                loadComponent: () => import("./pages/carrito/carrito").then(m => m.Carrito)
            }
        ]
    },
    { path: "**", redirectTo: "" }
];
