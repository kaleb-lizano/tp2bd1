/* Carga de catálogos en selects
   ===================================================== */
async function cargarPuestos() {
  const select = $("puestoEmpleado");

  try {
    const respuesta = await fetch(`${API_BASE}/catalogos/puestos`);
    const lista = await respuesta.json();

    select.innerHTML = `<option value="">Seleccione un puesto</option>` +
      lista.map(p => `<option value="${p.Nombre}">${p.Nombre}</option>`).join("");
  } catch (err) {
    console.error("Error al cargar puestos:", err);
    select.innerHTML = `<option value="">Error al cargar puestos</option>`;
  }
}

/* Filtros de empleados
   ===================================================== */
function detectarTipoFiltro(valor) {
  const texto = valor.trim();

  if (!texto) return "todos";
  if (/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(texto)) return "nombre";
  if (/^\d+$/.test(texto)) return "documento";

  return "invalido";
}

/* Tabla de empleados
   ===================================================== */
function cargarTabla(lista) {
  const tabla = $("tabla-empleados");
  tabla.innerHTML = "";

  if (!lista.length) {
    tabla.innerHTML = `<tr><td colspan="6">No se encontraron empleados.</td></tr>`;
    return;
  }

  lista.forEach(e => {
    const fila = document.createElement("tr");
    fila.innerHTML = crearFilaEmpleado(e);
    tabla.appendChild(fila);
  });
}

function crearFilaEmpleado(e) {
  const doc = e.ValorDocumentoIdentidad;
  const nombre = e.Nombre;
  const puesto = e.NombrePuesto || e.Puesto || "";
  const saldo = e.SaldoVacaciones;
  const activo = e.EsActivo;

  return `
    <td>${doc}</td>
    <td>${nombre}</td>
    <td>${puesto}</td>
    <td>${formatearSaldo(saldo)}</td>
    <td class="${activo ? "estadoActivo" : "estadoInactivo"}">
      ${activo ? "Activo" : "Inactivo"}
    </td>
    <td>
      <div class="accionesTabla">
        <button class="btn btnSecundario btnAccion" data-accion="consultar" data-doc="${doc}">Consultar</button>
        <button class="btn btnSecundario btnAccion" data-accion="editar" data-doc="${doc}">Editar</button>
        <button class="btn btnPeligro btnAccion" data-accion="eliminar" data-doc="${doc}">Eliminar</button>
        <button class="btn btnPrimario btnAccion" data-accion="movimientos" data-doc="${doc}">Movimientos</button>
      </div>
    </td>
  `;
}

/* CRUD de empleados
   ===================================================== */
function limpiarFormularioEmpleado() {
  $("form-empleado").reset();
  $("idEmpleadoEditar").value = "";
  $("titulo-formulario").textContent = "Insertar empleado";
  $("subtitulo-formulario").textContent = "Ingrese los datos del nuevo empleado o modifique los datos del empleado seleccionado.";
}

async function consultarEmpleado(doc) {
  try {
    const respuesta = await fetch(`${API_BASE}/empleados/${doc}`);
    const e = await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensaje($("mensaje-principal"), e.message || "Error al consultar empleado.", "error");
      return;
    }

    $("detalle-empleado").innerHTML = `
      <div class="detalleLista">
        <div><strong>Documento:</strong> ${e.ValorDocumentoIdentidad}</div>
        <div><strong>Nombre:</strong> ${e.Nombre}</div>
        <div><strong>Puesto:</strong> ${e.NombrePuesto}</div>
        <div><strong>Saldo vacaciones:</strong> ${formatearSaldo(e.SaldoVacaciones)}</div>
        <div><strong>Estado:</strong> ${e.EsActivo ? "Activo" : "Inactivo"}</div>
      </div>
    `;

    $("modal-detalle").classList.remove("oculto");
  } catch (err) {
    mostrarMensaje($("mensaje-principal"), "No se pudo conectar con el servidor.", "error");
  }
}

async function editarEmpleado(doc) {
  try {
    const respuesta = await fetch(`${API_BASE}/empleados/${doc}`);
    const e = await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensaje($("mensaje-principal"), e.message || "Error al consultar empleado.", "error");
      return;
    }

    $("titulo-formulario").textContent = "Editar empleado";
    $("subtitulo-formulario").textContent =
      `Datos actuales: ${e.ValorDocumentoIdentidad} - ${e.Nombre} | Puesto: ${e.NombrePuesto} | Saldo: ${formatearSaldo(e.SaldoVacaciones)}`;
    $("idEmpleadoEditar").value = e.ValorDocumentoIdentidad;
    $("valorDocumentoIdentidad").value = e.ValorDocumentoIdentidad;
    $("nombreEmpleado").value = e.Nombre;
    $("puestoEmpleado").value = e.NombrePuesto;

    limpiarMensaje($("mensaje-formulario"));
    mostrarVista("vista-formulario");
  } catch (err) {
    mostrarMensaje($("mensaje-principal"), "No se pudo conectar con el servidor.", "error");
  }
}

async function eliminarEmpleado(doc) {
  const sesion = obtenerSesion();

  try {
    const respConsulta = await fetch(`${API_BASE}/empleados/${doc}`);
    const e = await respConsulta.json();

    if (!respConsulta.ok) {
      mostrarMensaje($("mensaje-principal"), e.message || "Error al consultar empleado.", "error");
      return;
    }

    const ok = confirm(`¿Está seguro de eliminar este empleado?\n\nDocumento: ${e.ValorDocumentoIdentidad}\nNombre: ${e.Nombre}`);

    await fetch(`${API_BASE}/empleados/${doc}/eliminar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        confirmado: ok,
        username: sesion?.username || ""
      })
    });

    if (!ok) return;

    await cargarEmpleadosDesdeApi();
    mostrarMensaje($("mensaje-principal"), "Empleado eliminado lógicamente.");
  } catch (err) {
    mostrarMensaje($("mensaje-principal"), "No se pudo conectar con el servidor.", "error");
  }
}

async function guardarEmpleadoDesdeFormulario() {
  const docEditar = $("idEmpleadoEditar").value || null;
  const documento = $("valorDocumentoIdentidad").value.trim();
  const nombre = $("nombreEmpleado").value.trim();
  const puesto = $("puestoEmpleado").value;
  const sesion = obtenerSesion();

  if (!documento || !nombre || !puesto) {
    mostrarMensaje($("mensaje-formulario"), "Todos los campos son obligatorios.", "error");
    return;
  }

  try {
    let respuesta;

    if (docEditar) {
      respuesta = await fetch(`${API_BASE}/empleados/${docEditar}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valorDocumentoNuevo: documento,
          nombreNuevo: nombre,
          nombrePuestoNuevo: puesto,
          username: sesion?.username || ""
        })
      });
    } else {
      respuesta = await fetch(`${API_BASE}/empleados`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valorDocumentoIdentidad: documento,
          nombre,
          nombrePuesto: puesto,
          fechaContratacion: new Date().toISOString().slice(0, 10),
          saldoVacaciones: 0,
          esActivo: true,
          username: sesion?.username || ""
        })
      });
    }

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensaje($("mensaje-formulario"), datos.message || "Error al guardar empleado.", "error");
      return;
    }

    limpiarFormularioEmpleado();
    await cargarEmpleadosDesdeApi();
    mostrarVista("vista-principal");
    mostrarMensaje($("mensaje-principal"), docEditar ? "Empleado actualizado correctamente." : "Empleado insertado correctamente.");
  } catch (err) {
    mostrarMensaje($("mensaje-formulario"), "No se pudo conectar con el servidor.", "error");
  }
}

/* Obtener empleados desde API (usado por varias funciones)
   ===================================================== */
async function cargarEmpleadosDesdeApi(queryParams = "") {
  try {
    const sesion = obtenerSesion();
    const sep = queryParams ? "&" : "?";
    const url = queryParams
      ? `${API_BASE}/empleados?${queryParams}&username=${encodeURIComponent(sesion?.username || "")}`
      : `${API_BASE}/empleados?username=${encodeURIComponent(sesion?.username || "")}`;

    const respuesta = await fetch(url);
    const lista = await respuesta.json();

    cargarTabla(lista);
  } catch (err) {
    console.error("Error al cargar empleados:", err);
    $("tabla-empleados").innerHTML = `<tr><td colspan="6">Error al cargar empleados del servidor.</td></tr>`;
  }
}
