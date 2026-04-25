/* Inicialización de la aplicación principal
   ===================================================== */
function initApp() {
  const sesion = obtenerSesion();

  if (!sesion) {
    location.href = "login.html";
    return;
  }

  $("usuario-activo").textContent = `Usuario activo: ${sesion.username}`;
  $("btn-logout").addEventListener("click", cerrarSesion);

  cargarPuestos();
  cargarTiposMovimiento();
  cargarTabla(empleados);
  configurarEventosApp();
}

/* Eventos de la aplicación
   ===================================================== */
function configurarEventosApp() {
  $("btn-mostrar-formulario").addEventListener("click", () => {
    limpiarFormularioEmpleado();
    limpiarMensaje($("mensaje-formulario"));
    mostrarVista("vista-formulario");
  });

  $("btn-cancelar-formulario").addEventListener("click", () => {
    limpiarFormularioEmpleado();
    mostrarVista("vista-principal");
  });

  $("btn-filtrar").addEventListener("click", filtrarDesdeInterfaz);

  $("btn-limpiar-filtro").addEventListener("click", () => {
    $("filtro-empleado").value = "";
    cargarTabla(empleados);
    limpiarMensaje($("mensaje-principal"));
  });

  $("tabla-empleados").addEventListener("click", manejarAccionTabla);

  $("form-empleado").addEventListener("submit", e => {
    e.preventDefault();
    guardarEmpleadoDesdeFormulario();
  });

  $("btn-cerrar-modal").addEventListener("click", () => {
    $("modal-detalle").classList.add("oculto");
  });

  $("btn-volver-desde-movimientos").addEventListener("click", () => {
    cargarTabla(empleados);
    mostrarVista("vista-principal");
  });

  $("btn-mostrar-movimiento").addEventListener("click", prepararFormularioMovimiento);

  $("btn-cancelar-movimiento").addEventListener("click", () => {
    verMovimientos(idEmpleadoSeleccionado);
  });

  $("form-movimiento").addEventListener("submit", e => {
    e.preventDefault();
    guardarMovimientoDesdeFormulario();
  });
}

function filtrarDesdeInterfaz() {
  limpiarMensaje($("mensaje-principal"));

  const filtro = $("filtro-empleado").value;
  const tipo = detectarTipoFiltro(filtro);

  if (tipo === "invalido") {
    mostrarMensaje(
      $("mensaje-principal"),
      "El filtro solo puede contener letras y espacios, o solo números.",
      "error"
    );
    return;
  }

  if (tipo === "nombre") registrarBitacora("Consulta con filtro de nombre", filtro.trim());
  if (tipo === "documento") registrarBitacora("Consulta con filtro de cedula", filtro.trim());

  cargarTabla(filtrarEmpleados(empleados, filtro));
}

function manejarAccionTabla(e) {
  const btn = e.target.closest("button[data-accion]");
  if (!btn) return;

  const id = Number(btn.dataset.id);

  ({
    consultar: consultarEmpleado,
    editar: editarEmpleado,
    eliminar: eliminarEmpleado,
    movimientos: verMovimientos
  }[btn.dataset.accion])(id);
}

/* Punto de entrada
   ===================================================== */
const page = document.body.dataset.page;

if (page === "login") initLogin();
if (page === "app") initApp();
