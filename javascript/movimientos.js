/* Estado temporal de movimientos
   ===================================================== */
let idEmpleadoSeleccionado = null;

/* Carga de catálogos en selects
   ===================================================== */
function cargarTiposMovimiento() {
  const select = $("tipoMovimiento");
  select.innerHTML = `<option value="">Seleccione un tipo</option>` +
    tiposMovimiento.map(t => `<option value="${t.id}">${t.nombre} (${t.tipoAccion})</option>`).join("");
}

/* Movimientos
   ===================================================== */
function verMovimientos(id) {
  idEmpleadoSeleccionado = id;

  const e = empleados.find(x => x.id === id);
  const lista = movimientos
    .filter(m => m.idEmpleado === id)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  $("resumen-empleado-movimientos").textContent =
    `${e.valorDocumentoIdentidad} - ${e.nombre} | Saldo actual: ${formatearSaldo(e.saldoVacaciones)}`;

  $("tabla-movimientos").innerHTML = lista.length
    ? lista.map(crearFilaMovimiento).join("")
    : `<tr><td colspan="7">Este empleado no tiene movimientos.</td></tr>`;

  mostrarVista("vista-movimientos");
}

function crearFilaMovimiento(m) {
  return `
    <tr>
      <td>${formatearFecha(m.fecha)}</td>
      <td>${m.tipo}</td>
      <td>${m.monto}</td>
      <td>${formatearSaldo(m.nuevoSaldo)}</td>
      <td>${m.usuario}</td>
      <td>${m.ip}</td>
      <td>${m.postTime}</td>
    </tr>
  `;
}

function prepararFormularioMovimiento() {
  const e = empleados.find(x => x.id === idEmpleadoSeleccionado);

  $("resumen-empleado-form-movimiento").textContent =
    `${e.valorDocumentoIdentidad} - ${e.nombre} | Saldo actual: ${formatearSaldo(e.saldoVacaciones)}`;

  $("form-movimiento").reset();
  limpiarMensaje($("mensaje-formulario-movimiento"));
  mostrarVista("vista-formulario-movimiento");
}

function guardarMovimientoDesdeFormulario() {
  const emp = empleados.find(x => x.id === idEmpleadoSeleccionado);
  const tipo = tiposMovimiento.find(t => t.id === Number($("tipoMovimiento").value));
  const monto = Number($("montoMovimiento").value);

  if (!tipo || !monto || monto <= 0) {
    mostrarMensaje($("mensaje-formulario-movimiento"), "Debe seleccionar un tipo y un monto válido.", "error");
    return;
  }

  const nuevoSaldo = calcularNuevoSaldo(emp.saldoVacaciones, tipo.tipoAccion, monto);

  if (nuevoSaldo < 0) {
    registrarBitacora("Intento de insertar movimiento", `Saldo negativo rechazado, ${emp.valorDocumentoIdentidad}, ${emp.nombre}, saldo ${emp.saldoVacaciones}, ${tipo.nombre}, ${monto}`);
    mostrarMensaje($("mensaje-formulario-movimiento"), "Monto rechazado: el saldo quedaría negativo.", "error");
    return;
  }

  emp.saldoVacaciones = nuevoSaldo;
  insertarMovimiento(emp, tipo, monto, nuevoSaldo);
  verMovimientos(emp.id);
  mostrarMensaje($("mensaje-movimientos"), "Movimiento insertado correctamente.");
}

function calcularNuevoSaldo(saldoActual, tipoAccion, monto) {
  return tipoAccion === "Credito" ? saldoActual + monto : saldoActual - monto;
}

function insertarMovimiento(emp, tipo, monto, nuevoSaldo) {
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

  registrarBitacora("Insertar movimiento exitoso", `${emp.valorDocumentoIdentidad}, ${emp.nombre}, nuevo saldo ${nuevoSaldo}, ${tipo.nombre}, ${monto}`);
}
