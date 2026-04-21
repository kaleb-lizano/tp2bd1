/* Dummies
   ========================================================= */
let empleados = [
  { id: 5, nombre: "Luis Chaves", salario: 200000 },
  { id: 3, nombre: "Juan Perez", salario: 150000 },
  { id: 7, nombre: "Ana Rojas", salario: 350000 }
];


/* Conexión con HTML
   ========================================================= */
const vistaPrincipal = document.getElementById("vista-principal");
const vistaFormulario = document.getElementById("vista-formulario");

const tablaEmpleados = document.getElementById("tabla-empleados");
const mensajePrincipal = document.getElementById("mensaje-principal");
const mensajeFormulario = document.getElementById("mensaje-formulario");

const btnMostrarFormulario = document.getElementById("btn-mostrar-formulario");
const btnRegresar = document.getElementById("btn-regresar");
const formEmpleado = document.getElementById("form-empleado");

const inputNombre = document.getElementById("nombre");
const inputSalario = document.getElementById("salario");


/* Funciones
   ========================================================= */

// Mostrar página principal
function mostrarVistaPrincipal() {
  vistaFormulario.classList.add("oculto");
  vistaPrincipal.classList.remove("oculto");
}

// Mostrar página formulario
function mostrarVistaFormulario() {
  vistaPrincipal.classList.add("oculto");
  vistaFormulario.classList.remove("oculto");
}

// Limpiar inputs
function limpiarFormulario() {
  formEmpleado.reset();
  mensajeFormulario.innerHTML = "";
}

// Mostrar mensajes
function mostrarMensaje(contenedor, texto, tipo) {
  const claseTipo = tipo === "error" ? "mensajeError" : "mensajeExito";
  contenedor.innerHTML = `<div class="mensaje ${claseTipo}">${texto}</div>`;
}

// Limpiar mensajes
function limpiarMensaje(contenedor) {
  contenedor.innerHTML = "";
}

// Formatear salario
function formatearSalario(valor) {
  return "₡ " + Number(valor).toLocaleString("es-CR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4
  });
}


/* Backend
   ========================================================= */

const API_URL = "http://localhost:8081/api/empleados";

// Ordenar empleados
async function obtenerEmpleados() {
  const response = await fetch(`${API_URL}/obtenerEmpleados`);

  if (!response.ok) {
    throw new Error("No se pudo obtener empleados.");
  }

  const data = await response.json();

  return data.map((empleado) => ({
    id: empleado.Id,
    nombre: empleado.Nombre,
    salario: empleado.Salario,
  }));
}

// Insertar empleado
async function insertarEmpleado(nuevoEmpleado) {
  const response = await fetch(`${API_URL}/insertarEmpleado`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevoEmpleado),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "No se pudo insertar empleado.");
  }

  return data;
}

/* Mostrar datos de la tabla
   ========================================================= */

async function cargarTabla() {
  limpiarMensaje(mensajePrincipal);
  tablaEmpleados.innerHTML = "";

  const lista = await obtenerEmpleados();

  if (lista.length === 0) {
    tablaEmpleados.innerHTML = `
      <tr>
        <td colspan="3">No hay empleados registrados.</td>
      </tr>
    `;
    return;
  }

  lista.forEach((empleado) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${empleado.id}</td>
      <td>${empleado.nombre}</td>
      <td>${formatearSalario(empleado.salario)}</td>
    `;

    tablaEmpleados.appendChild(fila);
  });
}


/* Validaciones
   ========================================================= */

// Validar nombre (Expresión regular)
function validarNombre(nombre) {
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:[ -][A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;
  return regex.test(nombre);
}

// Validar salario (Expresión regular)
function validarSalario(salario) {
  const valor = salario.trim();
  const regex = /^(0|[1-9]\d*)(\.\d{1,4})?$/;
  return regex.test(valor) && Number(valor) > 0;
}


/* Interacciones
   ========================================================= */

// Mostrar formulario
btnMostrarFormulario.addEventListener("click", () => {
  limpiarFormulario();
  mostrarVistaFormulario();
});

// Regresar a tabla
btnRegresar.addEventListener("click", () => {
  limpiarFormulario();
  mostrarVistaPrincipal();
});

// Envío del formulario
formEmpleado.addEventListener("submit", async (event) => {
  event.preventDefault();

  limpiarMensaje(mensajeFormulario);

  const nombre = inputNombre.value.trim();
  const salario = inputSalario.value.trim();

  // Validaciones (Interacciones)
  if (!nombre || !salario) {
    mostrarMensaje(
      mensajeFormulario,
      "Los campos nombre y salario no pueden estar vacíos.",
      "error"
    );
    return;
  }

  if (!validarNombre(nombre)) {
    mostrarMensaje(
      mensajeFormulario,
      "El nombre solo puede contener letras, espacios o guion.",
      "error"
    );
    return;
  }

  if (!validarSalario(salario)) {
    mostrarMensaje(
      mensajeFormulario,
      "El salario debe ser un valor válido.",
      "error"
    );
    return;
  }

  // Inserción
  try {
    await insertarEmpleado({ nombre, salario });

    limpiarFormulario();
    await cargarTabla();
    mostrarVistaPrincipal();

    mostrarMensaje(mensajePrincipal, "Inserción exitosa.", "success");

  } catch (error) {
    mostrarMensaje(mensajeFormulario, error.message, "error");
  }
});


/* Iniciar
   ========================================================= */
cargarTabla();