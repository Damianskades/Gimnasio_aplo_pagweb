# Gimnasio_aplo_pagweb
Página web del gimnasio Apolo, hecha con **Angular 22**, **Bootstrap 5.3** y **Firebase (Firestore)**.

## Uso

```bash
npm install
npm run dev      # servidor de desarrollo en http://localhost:4200
npm run build    # versión de producción en dist/gimnasio-apolo/browser
```

## Rutas

| Ruta          | Página                         |
|---------------|--------------------------------|
| `#/`          | Inicio                         |
| `#/productos` | Productos (desde Firestore)    |
| `#/planes`    | Membresías (desde Firestore)   |
| `#/horarios`  | Horarios (desde Firestore)     |
| `#/contacto`  | Formulario de inscripción      |
| `#/admin`     | Panel de administración (CRUD) |

Las rutas usan `#` para que el sitio funcione en GitHub Pages sin configuración extra.
Para publicar, sube el contenido de `dist/gimnasio-apolo/browser`.

## Estructura

```
public/img/              imágenes del sitio
src/styles.css           tema negro/dorado sobre Bootstrap
src/app/
  app.routes.ts          rutas (cada página se carga bajo demanda)
  core/firebase.ts       conexión a Firestore
  models/                interfaces de Producto, Plan y Horario
  services/              servicios de Firestore (listar, crear, actualizar, eliminar)
  components/            header, footer, tarjeta y cargando
  layout/                estructura común de las páginas públicas
  pages/                 inicio, productos, planes, horarios, contacto y admin
  utils/                 constantes, datos de ejemplo y pipe de moneda
```
