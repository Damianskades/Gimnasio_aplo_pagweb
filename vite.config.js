import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        inicio: "index.html",
        admin: "admin.html",
        productos: "src/pages/productos.html",
        planes: "src/pages/planes.html",
        horarios: "src/pages/horarios.html",
        contacto: "src/pages/contacto.html"
      }
    }
  }
});
