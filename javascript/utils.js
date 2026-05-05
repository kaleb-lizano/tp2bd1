/* Constantes de almacenamiento local
   ===================================================== */
const STORAGE_KEYS = {
  sesion: "cv_sesion_usuario",
  xmlCargado: "cv_xml_cargado"
};

/* URL base de la API
   ===================================================== */
const API_BASE = "/api";

/* Utilidades generales
   ===================================================== */
function $(id) { return document.getElementById(id); }

function mostrarVista(vista) {
  ["vista-principal", "vista-formulario", "vista-movimientos", "vista-formulario-movimiento"]
    .forEach(id => $(id)?.classList.add("oculto"));

  $(vista)?.classList.remove("oculto");
}

function mostrarMensaje(contenedor, texto, tipo = "success") {
  if (!contenedor) return;
  const clase = tipo === "error" ? "mensajeError" : "mensajeExito";
  contenedor.innerHTML = `<div class="mensaje ${clase}">${texto}</div>`;
}

function limpiarMensaje(contenedor) {
  if (contenedor) contenedor.innerHTML = "";
}

function formatearSaldo(valor) {
  return `${Number(valor).toLocaleString("es-CR")} días`;
}

function formatearFechaSinHora(fechaIso) {
  if (!fechaIso) return "-";
  return new Date(fechaIso).toISOString().split("T")[0];
}

function formatearFecha(fechaIso) {
  if (!fechaIso) return "-";
  return new Date(fechaIso).toUTCString();
}

/* Sesión
   ===================================================== */
function obtenerSesion() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.sesion) || "null");
}

function guardarSesion(datos) {
  localStorage.setItem(STORAGE_KEYS.sesion, JSON.stringify(datos));
}

async function cerrarSesion() {
  const sesion = obtenerSesion();

  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: sesion?.username || "" })
    });
  } catch (err) {
    console.warn("Error al registrar logout:", err);
  }

  localStorage.removeItem(STORAGE_KEYS.sesion);
  location.href = "login.html";
}
