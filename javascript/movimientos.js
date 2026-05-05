/* Estado temporal de movimientos
   ===================================================== */
let docEmpleadoSeleccionado = null;

/* Carga de catálogos en selects
   ===================================================== */
async function cargarTiposMovimiento() {
  const select = $("tipoMovimiento");

  try {
    const respuesta = await fetch(`${API_BASE}/catalogos/tiposMovimiento`);
    const lista = await respuesta.json();

    select.innerHTML = `<option value="">Seleccione un tipo</option>` +
      lista.map(t => `<option value="${t.Nombre}">${t.Nombre} (${t.TipoAccion})</option>`).join("");
  } catch (err) {
    console.error("Error al cargar tipos de movimiento:", err);
    select.innerHTML = `<option value="">Error al cargar tipos</option>`;
  }
}

/* Movimientos
   ===================================================== */
async function verMovimientos(doc) {
  docEmpleadoSeleccionado = doc;

  try {
    const respuesta = await fetch(`${API_BASE}/movimientos/${doc}`);
    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensaje($("mensaje-movimientos"), datos.message || "Error al cargar movimientos.", "error");
      return;
    }

    const emp = datos.empleado;
    const lista = datos.movimientos || [];

    $("resumen-empleado-movimientos").textContent =
      `${emp.valorDocumentoIdentidad} - ${emp.nombre} | Saldo actual: ${formatearSaldo(emp.saldoVacaciones)}`;

    $("tabla-movimientos").innerHTML = lista.length
      ? lista.map(crearFilaMovimiento).join("")
      : `<tr><td colspan="7">Este empleado no tiene movimientos.</td></tr>`;

    mostrarVista("vista-movimientos");
  } catch (err) {
    mostrarMensaje($("mensaje-principal"), "No se pudo conectar con el servidor.", "error");
  }
}

function crearFilaMovimiento(m) {
  return `
    <tr>
      <td>${formatearFechaSinHora(m.Fecha)}</td>
      <td>${m.NombreTipoMovimiento}</td>
      <td>${m.Monto}</td>
      <td>${formatearSaldo(m.NuevoSaldo)}</td>
      <td>${m.NombreUsuario}</td>
      <td>${m.PostInIP}</td>
      <td>${formatearFecha(m.PostTime)}</td>
    </tr>
  `;
}

async function prepararFormularioMovimiento() {
  try {
    const respuesta = await fetch(`${API_BASE}/empleados/${docEmpleadoSeleccionado}`);
    const e = await respuesta.json();

    $("resumen-empleado-form-movimiento").textContent =
      `${e.ValorDocumentoIdentidad} - ${e.Nombre} | Saldo actual: ${formatearSaldo(e.SaldoVacaciones)}`;

    $("form-movimiento").reset();
    limpiarMensaje($("mensaje-formulario-movimiento"));
    mostrarVista("vista-formulario-movimiento");
  } catch (err) {
    mostrarMensaje($("mensaje-movimientos"), "No se pudo conectar con el servidor.", "error");
  }
}

async function guardarMovimientoDesdeFormulario() {
  const sesion = obtenerSesion();
  const tipoSelect = $("tipoMovimiento");
  const nombreTipo = tipoSelect.value;
  const monto = Number($("montoMovimiento").value);

  if (!nombreTipo || !monto || monto <= 0) {
    mostrarMensaje($("mensaje-formulario-movimiento"), "Debe seleccionar un tipo y un monto válido.", "error");
    return;
  }

  try {
    const respuesta = await fetch(`${API_BASE}/movimientos/${docEmpleadoSeleccionado}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombreTipoMovimiento: nombreTipo,
        monto,
        username: sesion?.username || ""
      })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensaje($("mensaje-formulario-movimiento"), datos.message || "Error al insertar movimiento.", "error");
      return;
    }

    await verMovimientos(docEmpleadoSeleccionado);
    mostrarMensaje($("mensaje-movimientos"), "Movimiento insertado correctamente.");
  } catch (err) {
    mostrarMensaje($("mensaje-formulario-movimiento"), "No se pudo conectar con el servidor.", "error");
  }
}
