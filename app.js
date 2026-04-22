/* HTML
   ===================================================== */
const vistaPrincipal = document.getElementById("vista-principal");
const vistaFormulario = document.getElementById("vista-formulario");

const mensajePrincipal = document.getElementById("mensaje-principal");
const mensajeFormulario = document.getElementById("mensaje-formulario");

const tablaEmpleados = document.getElementById("tabla-empleados");

const btnMostrarFormulario = document.getElementById("btn-mostrar-formulario");
const btnCancelarFormulario = document.getElementById("btn-cancelar-formulario");

const inputFiltroEmpleado = document.getElementById("filtro-empleado");
const btnFiltrar = document.getElementById("btn-filtrar");
const btnLimpiarFiltro = document.getElementById("btn-limpiar-filtro");

const formEmpleado = document.getElementById("form-empleado");
const inputDocumento = document.getElementById("valorDocumentoIdentidad");
const inputNombre = document.getElementById("nombreEmpleado");
const selectPuesto = document.getElementById("puestoEmpleado");

/* Dummies (Los valores "falsos" para probar)
   ===================================================== */
let empleados = [
  {
    id: 1,
    valorDocumentoIdentidad: "6993943",
    nombre: "Kaitlyn Jensen",
    puesto: "Camarero",
    fechaContratacion: "2017-12-07",
    saldoVacaciones: 12,
    esActivo: true
  },
  {
    id: 2,
    valorDocumentoIdentidad: "1896802",
    nombre: "Robert Buchanan",
    puesto: "Albañil",
    fechaContratacion: "2020-09-20",
    saldoVacaciones: 8,
    esActivo: true
  },
  {
    id: 3,
    valorDocumentoIdentidad: "5095109",
    nombre: "Christina Ward",
    puesto: "Cajero",
    fechaContratacion: "2015-09-13",
    saldoVacaciones: 0,
    esActivo: false
  },
  {
    id: 4,
    valorDocumentoIdentidad: "8403646",
    nombre: "Bradley Wright",
    puesto: "Fontanero",
    fechaContratacion: "2020-01-27",
    saldoVacaciones: 12,
    esActivo: true
  },
  {
    id: 5,
    valorDocumentoIdentidad: "6019592",
    nombre: "Robert Singh",
    puesto: "Conserje",
    fechaContratacion: "2017-02-01",
    saldoVacaciones: 8,
    esActivo: true
  },
  {
    id: 6,
    valorDocumentoIdentidad: "4510358",
    nombre: "Ryan Mitchell",
    puesto: "Asistente",
    fechaContratacion: "2018-06-08",
    saldoVacaciones: 0,
    esActivo: false
  },
  {
    id: 7,
    valorDocumentoIdentidad: "7517662",
    nombre: "Candace Fox",
    puesto: "Asistente",
    fechaContratacion: "2013-12-17",
    saldoVacaciones: 12,
    esActivo: true
  },
  {
    id: 8,
    valorDocumentoIdentidad: "8326328",
    nombre: "Allison Murillo",
    puesto: "Asistente",
    fechaContratacion: "2020-04-19",
    saldoVacaciones: 8,
    esActivo: true
  },
  {
    id: 9,
    valorDocumentoIdentidad: "2161775",
    nombre: "Jessica Murphy",
    puesto: "Cuidador",
    fechaContratacion: "2017-04-12",
    saldoVacaciones: 0,
    esActivo: false
  },
  {
    id: 10,
    valorDocumentoIdentidad: "2918773",
    nombre: "Nancy Newton PhD",
    puesto: "Fontanero",
    fechaContratacion: "2016-11-22",
    saldoVacaciones: 12,
    esActivo: true
  }
];

/* Manejo de vistas
   ===================================================== */
function mostrarVista(nombreVista) {
  if (nombreVista === "principal") {
    vistaPrincipal.classList.remove("oculto");
    vistaFormulario.classList.add("oculto");
    limpiarMensaje(mensajeFormulario);
    return;
  }

  if (nombreVista === "formulario") {
    vistaPrincipal.classList.add("oculto");
    vistaFormulario.classList.remove("oculto");
    limpiarMensaje(mensajePrincipal);
  }
}

/* Mensajes
   ===================================================== */
function mostrarMensaje(contenedor, texto, tipo) {
  const clase = tipo === "error" ? "mensajeError" : "mensajeExito";
  contenedor.innerHTML = `<div class="mensaje ${clase}">${texto}</div>`;
}

function limpiarMensaje(contenedor) {
  contenedor.innerHTML = "";
}

/* Formato de datos
   ===================================================== */
function formatearSaldo(valor) {
  return `${Number(valor).toLocaleString("es-CR")} días`;
}

function formatearFecha(fechaIso) {
  if (!fechaIso) return "-";

  const partes = fechaIso.split("-");
  if (partes.length !== 3) return fechaIso;

  const [anio, mes, dia] = partes;
  return `${dia}/${mes}/${anio}`;
}

/* Filtro
   ===================================================== */
function detectarTipoFiltro(valor) {
  const texto = valor.trim();

  if (!texto) return "todos";
  if (/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(texto)) return "nombre";
  if (/^\d+$/.test(texto)) return "documento";

  return "invalido";
}

function filtrarEmpleados(lista, filtro) {
  const texto = filtro.trim().toLowerCase();
  const tipo = detectarTipoFiltro(filtro);

  if (tipo === "todos") return lista;

  if (tipo === "nombre") {
    return lista.filter((empleado) =>
      empleado.nombre.toLowerCase().includes(texto)
    );
  }

  if (tipo === "documento") {
    return lista.filter((empleado) =>
      empleado.valorDocumentoIdentidad.includes(filtro.trim())
    );
  }

  return null;
}

/* Tabla
   ===================================================== */
function cargarTabla(lista = empleados) {
  limpiarMensaje(mensajePrincipal);
  tablaEmpleados.innerHTML = "";

  if (!lista || lista.length === 0) {
    tablaEmpleados.innerHTML = `
      <tr>
        <td colspan="6">No se encontraron empleados.</td>
      </tr>
    `;
    return;
  }

  lista.forEach((empleado) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${empleado.valorDocumentoIdentidad}</td>
      <td>${empleado.nombre}</td>
      <td>${empleado.puesto}</td>
      <td>${formatearSaldo(empleado.saldoVacaciones)}</td>
      <td class="${empleado.esActivo ? "estadoActivo" : "estadoInactivo"}">
        ${empleado.esActivo ? "Activo" : "Inactivo"}
      </td>
      <td>
        <div class="accionesTabla">
          <button class="btn btnSecundario btnAccion" onclick="consultarEmpleado(${empleado.id})">
            Consultar
          </button>
          <button class="btn btnSecundario btnAccion" onclick="editarEmpleado(${empleado.id})">
            Editar
          </button>
          <button class="btn btnSecundario btnAccion" onclick="eliminarEmpleado(${empleado.id})">
            Eliminar
          </button>
          <button class="btn btnPrimario btnAccion" onclick="verMovimientos(${empleado.id})">
            Movimientos
          </button>
        </div>
      </td>
    `;

    tablaEmpleados.appendChild(fila);
  });
}

/* Formulario
   ===================================================== */
function limpiarFormulario() {
  formEmpleado.reset();
}

function validarFormularioEmpleado() {
  const documento = inputDocumento.value.trim();
  const nombre = inputNombre.value.trim();
  const puesto = selectPuesto.value;

  if (!documento || !nombre || !puesto) {
    return "Todos los campos son obligatorios.";
  }

  if (!/^\d+$/.test(documento)) {
    return "El documento debe contener solo números.";
  }

  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre)) {
    return "El nombre debe contener solo letras y espacios.";
  }

  const existeDocumento = empleados.some(
    (empleado) => empleado.valorDocumentoIdentidad === documento
  );

  if (existeDocumento) {
    return "Ya existe un empleado con ese documento.";
  }

  const existeNombre = empleados.some(
    (empleado) => empleado.nombre.toLowerCase() === nombre.toLowerCase()
  );

  if (existeNombre) {
    return "Ya existe un empleado con ese nombre.";
  }

  return null;
}

function insertarEmpleadoTemporal() {
  const nuevoEmpleado = {
    id: empleados.length > 0 ? Math.max(...empleados.map((e) => e.id)) + 1 : 1,
    valorDocumentoIdentidad: inputDocumento.value.trim(),
    nombre: inputNombre.value.trim(),
    puesto: selectPuesto.value,
    fechaContratacion: new Date().toISOString().split("T")[0],
    saldoVacaciones: 0,
    esActivo: true
  };

  empleados.push(nuevoEmpleado);
}

/* Acciones de fila (temporales)
   ===================================================== */
function consultarEmpleado(id) {
  mostrarMensaje(
    mensajePrincipal,
    `Consultar empleado ${id} aún no implementado.`,
    "success"
  );
}

function editarEmpleado(id) {
  mostrarMensaje(
    mensajePrincipal,
    `Editar empleado ${id} aún no implementado.`,
    "success"
  );
}

function eliminarEmpleado(id) {
  mostrarMensaje(
    mensajePrincipal,
    `Eliminar empleado ${id} aún no implementado.`,
    "success"
  );
}

function verMovimientos(id) {
  mostrarMensaje(
    mensajePrincipal,
    `Movimientos del empleado ${id} aún no implementados.`,
    "success"
  );
}

/* Eventos
   ===================================================== */
btnMostrarFormulario.addEventListener("click", () => {
  limpiarFormulario();
  limpiarMensaje(mensajeFormulario);
  mostrarVista("formulario");
});

btnCancelarFormulario.addEventListener("click", () => {
  limpiarFormulario();
  mostrarVista("principal");
});

btnFiltrar.addEventListener("click", () => {
  limpiarMensaje(mensajePrincipal);

  const filtro = inputFiltroEmpleado.value;
  const tipo = detectarTipoFiltro(filtro);

  if (tipo === "invalido") {
    mostrarMensaje(
      mensajePrincipal,
      "El filtro solo puede contener letras y espacios, o solo números.",
      "error"
    );
    return;
  }

  const resultado = filtrarEmpleados(empleados, filtro);
  cargarTabla(resultado);
});

btnLimpiarFiltro.addEventListener("click", () => {
  inputFiltroEmpleado.value = "";
  limpiarMensaje(mensajePrincipal);
  cargarTabla(empleados);
});

formEmpleado.addEventListener("submit", (event) => {
  event.preventDefault();
  limpiarMensaje(mensajeFormulario);

  const error = validarFormularioEmpleado();

  if (error) {
    mostrarMensaje(mensajeFormulario, error, "error");
    return;
  }

  insertarEmpleadoTemporal();
  limpiarFormulario();
  cargarTabla(empleados);
  mostrarVista("principal");
  mostrarMensaje(mensajePrincipal, "Empleado agregado temporalmente a la UI.", "success");
});

/* Inicialización
   ===================================================== */
cargarTabla(empleados);