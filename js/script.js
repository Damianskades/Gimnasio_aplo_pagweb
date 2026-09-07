function registrar() {
    var nombre = document.getElementById("nombre").value;
    var apellido = document.getElementById("apellido").value;
    var correo = document.getElementById("correo").value;
    var plan = document.getElementById("plan").value;
    var mensaje = document.getElementById("mensaje");
    var precio = 0;

    if (nombre == "" || apellido == "" || correo == "") {
        mensaje.textContent = "Debes completar todos los campos.";
        mensaje.style.color = "red";
    } else {
        if (plan == "Día libre") {
            precio = 15;
        } else if (plan == "Mensual Básico") {
            precio = 89;
        } else if (plan == "Mensual Full") {
            precio = 129;
        } else if (plan == "Trimestral Full") {
            precio = 330;
        } else if (plan == "Anual Apolo") {
            precio = 1090;
        }

        mensaje.textContent = "Hola " + nombre + " " + apellido + ", tu inscripción al plan " + plan + 
        " por S/ " + precio + " fue registrada. Te escribiremos a " + correo;
        mensaje.style.color = "#C9A227";
    }
}
