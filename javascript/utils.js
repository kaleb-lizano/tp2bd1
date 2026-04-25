/* Constantes de almacenamiento local
   ===================================================== */
const STORAGE_KEYS = {
  sesion: "cv_sesion_usuario",
  intentos: "cv_intentos_login",
  bitacora: "cv_bitacora_eventos"
};

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

function formatearFecha(fechaIso) {
  if (!fechaIso) return "-";
  const [a, m, d] = fechaIso.split("-");
  return d && m && a ? `${d}/${m}/${a}` : fechaIso;
}

function obtenerIpDummy() { return "127.0.0.1"; }

/* Sesión
   ===================================================== */
function obtenerSesion() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.sesion) || "null");
}

function guardarSesion(usuario) {
  localStorage.setItem(
    STORAGE_KEYS.sesion,
    JSON.stringify({ id: usuario.id, username: usuario.username })
  );
}

function cerrarSesion() {
  registrarBitacora("Logout", "");
  localStorage.removeItem(STORAGE_KEYS.sesion);
  location.href = "login.html";
}

/* Bitácora dummy
   ===================================================== */
function registrarBitacora(tipoEvento, descripcion = "") {
  const bitacora = JSON.parse(localStorage.getItem(STORAGE_KEYS.bitacora) || "[]");
  const sesion = obtenerSesion();

  bitacora.push({
    tipoEvento,
    descripcion,
    idPostByUser: sesion?.id || null,
    username: sesion?.username || "sin sesión",
    postInIP: obtenerIpDummy(),
    postTime: new Date().toISOString()
  });

  localStorage.setItem(STORAGE_KEYS.bitacora, JSON.stringify(bitacora));
}
