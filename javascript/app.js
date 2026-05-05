/* =====================================================
   API – funciones de comunicación con el backend
   ===================================================== */
async function apiCargarXml() {
  const resp = await fetch(`${API_BASE}/admin/cargar-xml`, { method: "POST" });
  return resp.json();
}

/* =====================================================
   Inicialización de la aplicación principal
   ===================================================== */
async function initApp() {
  const sesion = obtenerSesion();

  if (!sesion) {
    location.href = "login.html";
    return;
  }

  $("usuario-activo").textContent = `Usuario activo: ${sesion.username}`;
  $("btn-logout").addEventListener("click", cerrarSesion);

  /* Cargar datos XML solo la primera vez
     ===================================================== */
  if (!localStorage.getItem(STORAGE_KEYS.xmlCargado)) {
    try {
      await apiCargarXml();
      localStorage.setItem(STORAGE_KEYS.xmlCargado, "true");
    } catch (err) {
      console.warn("Aviso al cargar XML desde frontend:", err.message);
    }
  }

  await cargarPuestos();
  await cargarTiposMovimiento();
  await cargarEmpleadosDesdeApi();
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

  $("btn-cancelar-formulario").addEventListener("click", async () => {
    limpiarFormularioEmpleado();
    await cargarEmpleadosDesdeApi();
    mostrarVista("vista-principal");
  });

  $("btn-filtrar").addEventListener("click", filtrarDesdeInterfaz);

  $("btn-limpiar-filtro").addEventListener("click", async () => {
    $("filtro-empleado").value = "";
    await cargarEmpleadosDesdeApi();
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

  $("btn-volver-desde-movimientos").addEventListener("click", async () => {
    await cargarEmpleadosDesdeApi();
    mostrarVista("vista-principal");
  });

  $("btn-mostrar-movimiento").addEventListener("click", prepararFormularioMovimiento);

  $("btn-cancelar-movimiento").addEventListener("click", () => {
    verMovimientos(docEmpleadoSeleccionado);
  });

  $("form-movimiento").addEventListener("submit", e => {
    e.preventDefault();
    guardarMovimientoDesdeFormulario();
  });
}

async function filtrarDesdeInterfaz() {
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

  let queryParams = "";

  if (tipo === "nombre") {
    queryParams = `filtroNombre=${encodeURIComponent(filtro.trim())}`;
  } else if (tipo === "documento") {
    queryParams = `filtroDocumento=${encodeURIComponent(filtro.trim())}`;
  }

  await cargarEmpleadosDesdeApi(queryParams);
}

function manejarAccionTabla(e) {
  const btn = e.target.closest("button[data-accion]");
  if (!btn) return;

  const doc = btn.dataset.doc;

  ({
    consultar: consultarEmpleado,
    editar: editarEmpleado,
    eliminar: eliminarEmpleado,
    movimientos: verMovimientos
  }[btn.dataset.accion])(doc);
}

/* Punto de entrada
   ===================================================== */
const page = document.body.dataset.page;

if (page === "login") initLogin();
if (page === "app") initApp();
