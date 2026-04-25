/* Carga de catálogos en selects
   ===================================================== */
function cargarPuestos() {
  const select = $("puestoEmpleado");
  select.innerHTML = `<option value="">Seleccione un puesto</option>` +
    puestos.map(p => `<option value="${p}">${p}</option>`).join("");
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

function filtrarEmpleados(lista, filtro) {
  const texto = filtro.trim().toLowerCase();
  const tipo = detectarTipoFiltro(filtro);

  if (tipo === "todos") return lista;
  if (tipo === "nombre") return lista.filter(e => e.nombre.toLowerCase().includes(texto));
  if (tipo === "documento") return lista.filter(e => e.valorDocumentoIdentidad.includes(filtro.trim()));

  return null;
}

/* Tabla de empleados
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
    fila.innerHTML = crearFilaEmpleado(e);
    tabla.appendChild(fila);
  });
}

function crearFilaEmpleado(e) {
  return `
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
}

/* Validaciones de empleado
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
  $("subtitulo-formulario").textContent = "Ingrese los datos del nuevo empleado o modifique los datos del empleado seleccionado.";
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
  $("subtitulo-formulario").textContent =
    `Datos actuales: ${e.valorDocumentoIdentidad} - ${e.nombre} | Puesto: ${e.puesto} | Saldo: ${formatearSaldo(e.saldoVacaciones)}`;
  $("idEmpleadoEditar").value = e.id;
  $("valorDocumentoIdentidad").value = e.valorDocumentoIdentidad;
  $("nombreEmpleado").value = e.nombre;
  $("puestoEmpleado").value = e.puesto;

  limpiarMensaje($("mensaje-formulario"));
  mostrarVista("vista-formulario");
}

function eliminarEmpleado(id) {
  const e = empleados.find(x => x.id === id);
  const ok = confirm(`¿Está seguro de eliminar este empleado?\n\nDocumento: ${e.valorDocumentoIdentidad}\nNombre: ${e.nombre}`);

  if (!ok) {
    registrarBitacora("Intento de borrado", `${e.valorDocumentoIdentidad}, ${e.nombre}, ${e.puesto}, ${e.saldoVacaciones}`);
    return;
  }

  e.esActivo = false;
  registrarBitacora("Borrado exitoso", `${e.valorDocumentoIdentidad}, ${e.nombre}, ${e.puesto}, ${e.saldoVacaciones}`);

  cargarTabla(empleados);
  mostrarMensaje($("mensaje-principal"), "Empleado eliminado lógicamente.");
}

function guardarEmpleadoDesdeFormulario() {
  const idEditar = Number($("idEmpleadoEditar").value) || null;
  const documento = $("valorDocumentoIdentidad").value.trim();
  const nombre = $("nombreEmpleado").value.trim();
  const puesto = $("puestoEmpleado").value;
  const error = validarEmpleado(documento, nombre, puesto, idEditar);

  if (error) {
    registrarBitacora(idEditar ? "Update no exitoso" : "Insercion no exitosa", `${error}, ${documento}, ${nombre}, ${puesto}`);
    mostrarMensaje($("mensaje-formulario"), error, "error");
    return;
  }

  idEditar ? actualizarEmpleado(idEditar, documento, nombre, puesto) : insertarEmpleado(documento, nombre, puesto);

  limpiarFormularioEmpleado();
  cargarTabla(empleados);
  mostrarVista("vista-principal");
}

function actualizarEmpleado(idEditar, documento, nombre, puesto) {
  const emp = empleados.find(x => x.id === idEditar);
  const antes = `${emp.valorDocumentoIdentidad}, ${emp.nombre}, ${emp.puesto}`;

  Object.assign(emp, { valorDocumentoIdentidad: documento, nombre, puesto });

  registrarBitacora("Update exitoso", `Antes: ${antes}. Después: ${documento}, ${nombre}, ${puesto}. Saldo: ${emp.saldoVacaciones}`);
  mostrarMensaje($("mensaje-principal"), "Empleado actualizado correctamente.");
}

function insertarEmpleado(documento, nombre, puesto) {
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
