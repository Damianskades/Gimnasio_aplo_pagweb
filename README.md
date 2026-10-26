# Gimnasio_aplo_pagweb
Página web del gimnasio Apolo, hecha con **Angular 22**, **Bootstrap 5.3** y **Firebase (Firestore)**.

## Uso

```bash
npm install
npm run dev      # servidor de desarrollo en http://localhost:4200
npm run build    # versión de producción en dist/gimnasio-apolo/browser
```

## Rutas

| Ruta            | Página                                                  |
|-----------------|---------------------------------------------------------|
| `#/`            | Inicio                                                  |
| `#/productos`   | Productos (desde Firestore)                             |
| `#/planes`      | Membresías (desde Firestore)                            |
| `#/horarios`    | Horarios (desde Firestore)                              |
| `#/contacto`    | Formulario de inscripción                               |
| `#/login`       | Iniciar sesión, registrarse o acceso de administrador   |
| `#/carrito`     | Carrito de compras y confirmación del pedido            |
| `#/mis-pedidos` | Historial de pedidos del usuario (requiere sesión)      |
| `#/admin`       | Panel de administración (solo cuentas con rol `admin`)  |

Las rutas usan `#` para que el sitio funcione en GitHub Pages sin configuración extra.
Para publicar, sube el contenido de `dist/gimnasio-apolo/browser`.

## Crear un administrador

El rol se guarda en Firestore, en el campo `rol` del documento `usuarios/{uid}`.
Los usuarios que se registran desde la web no tienen ese campo y son clientes.

1. En la consola de Firebase, ve a **Authentication > Users** y crea la cuenta con
   **Add user** (correo y contraseña). También puedes usar una cuenta registrada desde la web.
2. Copia el **User UID** de esa cuenta.
3. En **Firestore Database**, abre la colección `usuarios` y crea (o edita) el documento
   cuyo ID sea ese UID.
4. Agrega el campo `rol` de tipo `string` con el valor `admin`.
5. Entra a `#/login`, pulsa **Acceso administrador** e ingresa con esa cuenta.
   El enlace **Panel Admin** aparece en el menú.

## Estructura

```
public/img/              imágenes del sitio
src/styles.css           tema negro/dorado sobre Bootstrap
src/app/
  app.routes.ts          rutas (cada página se carga bajo demanda)
  core/firebase.ts       conexión a Firebase
  core/guards.ts         protección de las rutas admin y mis-pedidos
  models/                interfaces de Producto, Plan y Horario
  services/              servicios de Firestore (listar, crear, actualizar, eliminar)
  components/            header, footer, tarjeta y cargando
  layout/                estructura común de las páginas públicas
  pages/                 inicio, productos, planes, horarios, contacto, login,
                         carrito, mis-pedidos y admin
  utils/                 constantes, datos de ejemplo y pipe de moneda
```
