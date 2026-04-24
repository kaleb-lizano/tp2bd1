/* HTML (Storage Keys)
   ===================================================== */
const STORAGE_KEYS = {
  sesion: "cv_sesion_usuario",
  intentos: "cv_intentos_login",
  bitacora: "cv_bitacora_eventos"
};

/* Dummies (Los valores "falsos" para probar)
   ===================================================== */
let empleados = [
  {
    id: 1,
    valorDocumentoIdentidad: "6993943",
    nombre: "Kaitlyn Jensen",
    puesto: "Camarero",
    fechaContratacion: "2017-12-07",
    saldoVacaciones: 6,
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
    saldoVacaciones: 26,
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
    saldoVacaciones: 10,
    esActivo: true
  },
  {
    id: 8,
    valorDocumentoIdentidad: "8326328",
    nombre: "Allison Murillo",
    puesto: "Asistente",
    fechaContratacion: "2020-04-19",
    saldoVacaciones: 0,
    esActivo: true
  },
  {
    id: 9,
    valorDocumentoIdentidad: "2161775",
    nombre: "Jessica Murphy",
    puesto: "Cuidador",
    fechaContratacion: "2017-04-12",
    saldoVacaciones: 2,
    esActivo: false
  },
  {
    id: 10,
    valorDocumentoIdentidad: "2918773",
    nombre: "Nancy Newton",
    puesto: "Fontanero",
    fechaContratacion: "2016-11-22",
    saldoVacaciones: 0,
    esActivo: true
  }
];

/* Usuarios Dummy
   ===================================================== */
const usuarios = [
  { id: 1, username: "admin", password: "123" }
];

/* Puestos Dummy
   ===================================================== */
const puestos = [
  "Albañil",
  "Asistente",
  "Cajero",
  "Camarero",
  "Conductor",
  "Conserje",
  "Cuidador",
  "Fontanero",
  "Niñera",
  "Recepcionista"
].sort();

const tiposMovimiento = [
  { id: 1, nombre: "Cumplir mes", tipoAccion: "Credito" },
  { id: 2, nombre: "Bono vacacional", tipoAccion: "Credito" },
  { id: 3, nombre: "Reversion Debito", tipoAccion: "Credito" },
  { id: 4, nombre: "Disfrute de vacaciones", tipoAccion: "Debito" },
  { id: 5, nombre: "Venta de vacaciones", tipoAccion: "Debito" },
  { id: 6, nombre: "Reversion de Credito", tipoAccion: "Debito" }
];

/* Movimientos Dummy
   ===================================================== */
let movimientos = [
  {
    id: 1,
    idEmpleado: 7,
    fecha: "2024-01-18",
    tipo: "Venta de vacaciones",
    monto: 2,
    nuevoSaldo: 10,
    usuario: "hardingmicheal",
    ip: "42.142.119.153",
    postTime: "2024-01-18 18:47:14"
  },
  {
    id: 2,
    idEmpleado: 1,
    fecha: "2024-10-31",
    tipo: "Bono vacacional",
    monto: 1,
    nuevoSaldo: 13,
    usuario: "mgarrison",
    ip: "156.92.82.57",
    postTime: "2024-10-31 12:43:18"
  },
  {
    id: 3,
    idEmpleado: 1,
    fecha: "2024-11-20",
    tipo: "Disfrute de vacaciones",
    monto: 6,
    nuevoSaldo: 6,
    usuario: "hardingmicheal",
    ip: "4.176.52.1",
    postTime: "2024-11-20 23:31:41"
  },
  {
    id: 4,
    idEmpleado: 4,
    fecha: "2024-08-25",
    tipo: "Bono vacacional",
    monto: 8,
    nuevoSaldo: 26,
    usuario: "jgonzalez",
    ip: "204.0.219.231",
    postTime: "2024-08-25 16:24:07"
  },
  {
    id: 5,
    idEmpleado: 10,
    fecha: "2024-10-30",
    tipo: "Disfrute de vacaciones",
    monto: 10,
    nuevoSaldo: 0,
    usuario: "zkelly",
    ip: "220.164.108.231",
    postTime: "2024-10-30 03:55:57"
  }
];

/* Bitácora Dummy
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

/* Estado temporal de la interfaz
   ===================================================== */
let idEmpleadoSeleccionado = null;

/* Funciones
   ===================================================== */
function $(id) {
  return document.getElementById(id);
}

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

function obtenerIpDummy() {
  return "127.0.0.1";
}

/* Login
   ===================================================== */
function initLogin() {
  const form = $("form-login");
  const inputUser = $("username");
  const inputPass = $("password");
  const btnLogin = $("btn-login");
  const mensaje = $("mensaje-login");
  const usuarioActual = obtenerSesion();

  if (usuarioActual) location.href = "index.html";

  function obtenerIntentos(username) {
    const todos = JSON.parse(localStorage.getItem(STORAGE_KEYS.intentos) || "{}");
    return todos[username] || [];
  }

  function guardarIntento(username) {
    const ahora = Date.now();
    const todos = JSON.parse(localStorage.getItem(STORAGE_KEYS.intentos) || "{}");

    todos[username] = [...(todos[username] || []), ahora];
    localStorage.setItem(STORAGE_KEYS.intentos, JSON.stringify(todos));
  }

  function estaBloqueado(username) {
    const ahora = Date.now();
    const intentosRecientes = obtenerIntentos(username).filter(
      t => ahora - t <= 20 * 60 * 1000
    );
    const ultimoIntento = Math.max(0, ...intentosRecientes);

    return intentosRecientes.length > 5 && ahora - ultimoIntento <= 10 * 60 * 1000;
  }

  inputUser.addEventListener("input", () => {
    const bloqueado = estaBloqueado(inputUser.value.trim());
    btnLogin.disabled = bloqueado;

    if (bloqueado) {
      mostrarMensaje(
        mensaje,
        "Demasiados intentos de login, intente de nuevo dentro de 10 minutos.",
        "error"
      );
    } else {
      limpiarMensaje(mensaje);
    }
  });

  form.addEventListener("submit", e => {
    e.preventDefault();

    const username = inputUser.value.trim();
    const password = inputPass.value.trim();

    if (estaBloqueado(username)) {
      registrarBitacora("Login deshabilitado", username);
      mostrarMensaje(
        mensaje,
        "Demasiados intentos de login, intente de nuevo dentro de 10 minutos.",
        "error"
      );
      btnLogin.disabled = true;
      return;
    }

    const usuario = usuarios.find(
      u => u.username === username && u.password === password
    );

    if (!usuario) {
      guardarIntento(username);

      const cantidad = obtenerIntentos(username).filter(
        t => Date.now() - t <= 20 * 60 * 1000
      ).length;

      registrarBitacora(
        "Login No Exitoso",
        `Intento ${cantidad}. Código de error: 50001/50002. Usuario: ${username}`
      );
      mostrarMensaje(mensaje, "Credenciales incorrectas.", "error");
      return;
    }

    guardarSesion(usuario);
    registrarBitacora("Login Exitoso", "Exitoso");
    location.href = "index.html";
  });
}

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

/* Carga de Dummies (De momento)
   ===================================================== */
function cargarPuestos() {
  const select = $("puestoEmpleado");

  select.innerHTML =
    `<option value="">Seleccione un puesto</option>` +
    puestos.map(p => `<option value="${p}">${p}</option>`).join("");
}

function cargarTiposMovimiento() {
  const select = $("tipoMovimiento");

  select.innerHTML =
    `<option value="">Seleccione un tipo</option>` +
    tiposMovimiento
      .map(t => `<option value="${t.id}">${t.nombre} (${t.tipoAccion})</option>`)
      .join("");
}

/* Navegación entre las Vistas
   ===================================================== */
function mostrarVista(vista) {
  [
    "vista-principal",
    "vista-formulario",
    "vista-movimientos",
    "vista-formulario-movimiento"
  ].forEach(id => $(id).classList.add("oculto"));

  $(vista).classList.remove("oculto");
}

/* Filtros
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
  if (tipo === "nombre") return lista.filter(e => e.nombre.toLowerCase().includes(texto));
  if (tipo === "documento") return lista.filter(e => e.valorDocumentoIdentidad.includes(filtro.trim()));

  return null;
}

/* Tabla
   ===================================================== */
function cargarTabla(lista) {
  const tabla = $("tabla-empleados");
  tabla.innerHTML = "";

  const ordenada = [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre));

  if (!ordenada.length) {
    tabla.innerHTML = `<tr><td colspan="6">No se encontraron empleados.</td></tr>`;
    return;
  }

  ordenada.forEach(e => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${e.valorDocumentoIdentidad}</td>
      <td>${e.nombre}</td>
      <td>${e.puesto}</td>
      <td>${formatearSaldo(e.saldoVacaciones)}</td>
      <td class="${e.esActivo ? "estadoActivo" : "estadoInactivo"}">
        ${e.esActivo ? "Activo" : "Inactivo"}
      </td>
      <td>
        <div class="accionesTabla">
          <button class="btn btnSecundario btnAccion" data-accion="consultar" data-id="${e.id}">Consultar</button>
          <button class="btn btnSecundario btnAccion" data-accion="editar" data-id="${e.id}">Editar</button>
          <button class="btn btnPeligro btnAccion" data-accion="eliminar" data-id="${e.id}">Eliminar</button>
          <button class="btn btnPrimario btnAccion" data-accion="movimientos" data-id="${e.id}">Movimientos</button>
        </div>
      </td>
    `;

    tabla.appendChild(fila);
  });
}

/* Validaciones
   ===================================================== */
function validarEmpleado(documento, nombre, puesto, idIgnorar = null) {
  if (!documento || !nombre || !puesto) return "Todos los campos son obligatorios.";
  if (!/^\d+$/.test(documento)) return "El documento debe contener solo números.";
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre)) return "El nombre debe contener solo letras y espacios.";

  if (empleados.some(e => e.id !== idIgnorar && e.valorDocumentoIdentidad === documento)) {
    return "Ya existe un empleado con ese documento.";
  }

  if (empleados.some(e => e.id !== idIgnorar && e.nombre.toLowerCase() === nombre.toLowerCase())) {
    return "Ya existe un empleado con ese nombre.";
  }

  return null;
}

/* CRUD de empleados
   ===================================================== */
function limpiarFormularioEmpleado() {
  $("form-empleado").reset();
  $("idEmpleadoEditar").value = "";
  $("titulo-formulario").textContent = "Insertar empleado";
}

function consultarEmpleado(id) {
  const e = empleados.find(x => x.id === id);

  $("detalle-empleado").innerHTML = `
    <div class="detalleLista">
      <div><strong>Documento:</strong> ${e.valorDocumentoIdentidad}</div>
      <div><strong>Nombre:</strong> ${e.nombre}</div>
      <div><strong>Puesto:</strong> ${e.puesto}</div>
      <div><strong>Saldo vacaciones:</strong> ${formatearSaldo(e.saldoVacaciones)}</div>
      <div><strong>Estado:</strong> ${e.esActivo ? "Activo" : "Inactivo"}</div>
    </div>
  `;

  $("modal-detalle").classList.remove("oculto");
}

function editarEmpleado(id) {
  const e = empleados.find(x => x.id === id);

  $("titulo-formulario").textContent = "Editar empleado";
  $("idEmpleadoEditar").value = e.id;
  $("valorDocumentoIdentidad").value = e.valorDocumentoIdentidad;
  $("nombreEmpleado").value = e.nombre;
  $("puestoEmpleado").value = e.puesto;

  limpiarMensaje($("mensaje-formulario"));
  mostrarVista("vista-formulario");
}

function eliminarEmpleado(id) {
  const e = empleados.find(x => x.id === id);
  const ok = confirm(
    `¿Está seguro de eliminar este empleado?\n\nDocumento: ${e.valorDocumentoIdentidad}\nNombre: ${e.nombre}`
  );

  if (!ok) {
    registrarBitacora(
      "Intento de borrado",
      `${e.valorDocumentoIdentidad}, ${e.nombre}, ${e.puesto}, ${e.saldoVacaciones}`
    );
    return;
  }

  e.esActivo = false;
  registrarBitacora(
    "Borrado exitoso",
    `${e.valorDocumentoIdentidad}, ${e.nombre}, ${e.puesto}, ${e.saldoVacaciones}`
  );

  cargarTabla(empleados);
  mostrarMensaje($("mensaje-principal"), "Empleado eliminado lógicamente.");
}

/* Movimientos
   ===================================================== */
function verMovimientos(id) {
  idEmpleadoSeleccionado = id;

  const e = empleados.find(x => x.id === id);
  const tabla = $("tabla-movimientos");
  const lista = movimientos
    .filter(m => m.idEmpleado === id)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  $("resumen-empleado-movimientos").textContent =
    `${e.valorDocumentoIdentidad} - ${e.nombre} | Saldo actual: ${formatearSaldo(e.saldoVacaciones)}`;

  tabla.innerHTML = lista.length
    ? lista
        .map(
          m => `
            <tr>
              <td>${formatearFecha(m.fecha)}</td>
              <td>${m.tipo}</td>
              <td>${m.monto}</td>
              <td>${formatearSaldo(m.nuevoSaldo)}</td>
              <td>${m.usuario}</td>
              <td>${m.ip}</td>
              <td>${m.postTime}</td>
            </tr>
          `
        )
        .join("")
    : `<tr><td colspan="7">Este empleado no tiene movimientos.</td></tr>`;

  mostrarVista("vista-movimientos");
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

  $("btn-filtrar").addEventListener("click", () => {
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
  });

  $("btn-limpiar-filtro").addEventListener("click", () => {
    $("filtro-empleado").value = "";
    cargarTabla(empleados);
    limpiarMensaje($("mensaje-principal"));
  });

  $("tabla-empleados").addEventListener("click", e => {
    const btn = e.target.closest("button[data-accion]");
    if (!btn) return;

    const id = Number(btn.dataset.id);

    ({
      consultar: consultarEmpleado,
      editar: editarEmpleado,
      eliminar: eliminarEmpleado,
      movimientos: verMovimientos
    }[btn.dataset.accion])(id);
  });

  $("form-empleado").addEventListener("submit", e => {
    e.preventDefault();

    const idEditar = Number($("idEmpleadoEditar").value) || null;
    const documento = $("valorDocumentoIdentidad").value.trim();
    const nombre = $("nombreEmpleado").value.trim();
    const puesto = $("puestoEmpleado").value;
    const error = validarEmpleado(documento, nombre, puesto, idEditar);

    if (error) {
      registrarBitacora(
        idEditar ? "Update no exitoso" : "Insercion no exitosa",
        `${error}, ${documento}, ${nombre}, ${puesto}`
      );
      mostrarMensaje($("mensaje-formulario"), error, "error");
      return;
    }

    if (idEditar) {
      const emp = empleados.find(x => x.id === idEditar);
      const antes = `${emp.valorDocumentoIdentidad}, ${emp.nombre}, ${emp.puesto}`;

      Object.assign(emp, { valorDocumentoIdentidad: documento, nombre, puesto });

      registrarBitacora(
        "Update exitoso",
        `Antes: ${antes}. Después: ${documento}, ${nombre}, ${puesto}. Saldo: ${emp.saldoVacaciones}`
      );
      mostrarMensaje($("mensaje-principal"), "Empleado actualizado correctamente.");
    } else {
      empleados.push({
        id: Math.max(...empleados.map(x => x.id)) + 1,
        valorDocumentoIdentidad: documento,
        nombre,
        puesto,
        fechaContratacion: new Date().toISOString().slice(0, 10),
        saldoVacaciones: 0,
        esActivo: true
      });

      registrarBitacora("Insercion exitosa", `${documento}, ${nombre}, ${puesto}`);
      mostrarMensaje($("mensaje-principal"), "Empleado insertado correctamente.");
    }

    limpiarFormularioEmpleado();
    cargarTabla(empleados);
    mostrarVista("vista-principal");
  });

  $("btn-cerrar-modal").addEventListener("click", () => {
    $("modal-detalle").classList.add("oculto");
  });

  $("btn-volver-desde-movimientos").addEventListener("click", () => {
    cargarTabla(empleados);
    mostrarVista("vista-principal");
  });

  $("btn-mostrar-movimiento").addEventListener("click", () => {
    const e = empleados.find(x => x.id === idEmpleadoSeleccionado);

    $("resumen-empleado-form-movimiento").textContent =
      `${e.valorDocumentoIdentidad} - ${e.nombre} | Saldo actual: ${formatearSaldo(e.saldoVacaciones)}`;

    $("form-movimiento").reset();
    limpiarMensaje($("mensaje-formulario-movimiento"));
    mostrarVista("vista-formulario-movimiento");
  });

  $("btn-cancelar-movimiento").addEventListener("click", () => {
    verMovimientos(idEmpleadoSeleccionado);
  });

  $("form-movimiento").addEventListener("submit", e => {
    e.preventDefault();

    const emp = empleados.find(x => x.id === idEmpleadoSeleccionado);
    const tipo = tiposMovimiento.find(t => t.id === Number($("tipoMovimiento").value));
    const monto = Number($("montoMovimiento").value);

    if (!tipo || !monto || monto <= 0) {
      mostrarMensaje(
        $("mensaje-formulario-movimiento"),
        "Debe seleccionar un tipo y un monto válido.",
        "error"
      );
      return;
    }

    const nuevoSaldo =
      tipo.tipoAccion === "Credito"
        ? emp.saldoVacaciones + monto
        : emp.saldoVacaciones - monto;

    if (nuevoSaldo < 0) {
      registrarBitacora(
        "Intento de insertar movimiento",
        `Saldo negativo rechazado, ${emp.valorDocumentoIdentidad}, ${emp.nombre}, saldo ${emp.saldoVacaciones}, ${tipo.nombre}, ${monto}`
      );
      mostrarMensaje(
        $("mensaje-formulario-movimiento"),
        "Monto rechazado: el saldo quedaría negativo.",
        "error"
      );
      return;
    }

    emp.saldoVacaciones = nuevoSaldo;

    const sesion = obtenerSesion();
    movimientos.push({
      id: Math.max(0, ...movimientos.map(m => m.id)) + 1,
      idEmpleado: emp.id,
      fecha: new Date().toISOString().slice(0, 10),
      tipo: tipo.nombre,
      monto,
      nuevoSaldo,
      usuario: sesion.username,
      ip: obtenerIpDummy(),
      postTime: new Date().toISOString().replace("T", " ").slice(0, 19)
    });

    registrarBitacora(
      "Insertar movimiento exitoso",
      `${emp.valorDocumentoIdentidad}, ${emp.nombre}, nuevo saldo ${nuevoSaldo}, ${tipo.nombre}, ${monto}`
    );

    verMovimientos(emp.id);
    mostrarMensaje($("mensaje-movimientos"), "Movimiento insertado correctamente.");
  });
}

/* Inicialización
   ===================================================== */
const page = document.body.dataset.page;

if (page === "login") initLogin();
if (page === "app") initApp();
