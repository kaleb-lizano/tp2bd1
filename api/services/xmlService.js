const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const sql = require("mssql");
const config = require("../config");

async function cargarDatosXml() {
  const xmlPath = path.join(__dirname, "../../data/datosCarga.xml");
  const xmlData = fs.readFileSync(xmlPath, "utf-8");
  const conexion = await sql.connect(config.sql);

  console.log("Cargando catalogs y empleados desde XML...");
  const resultCarga = await conexion.request()
    .input("inXml", sql.Xml, xmlData)
    .output("outResultCode", sql.Int)
    .execute("usp_CargarDatosXml");

  if (resultCarga.output.outResultCode !== 0) {
    throw new Error("Error al cargar catalogos y empleados desde XML. Codigo: " + resultCarga.output.outResultCode);
  }

  console.log("Cargando Movimientos...");
  const parser = new xml2js.Parser({ explicitArray: false });
  const result = await parser.parseStringPromise(xmlData);
  const datos = result.Datos;

  if (datos.Movimientos && datos.Movimientos.movimiento) {
    const movimientos = Array.isArray(datos.Movimientos.movimiento) ? datos.Movimientos.movimiento : [datos.Movimientos.movimiento];
    for (const mov of movimientos) {
      const nombreTipoMovimiento = mov.$.IdTipoMovimiento;

      const empleadoResult = await conexion.request()
        .input("inValorDocumentoIdentidad", sql.VarChar(16), mov.$.ValorDocId)
        .output("outResultCode", sql.Int)
        .execute("usp_ObtenerEmpleadoPorDocumento");

      const empleado = empleadoResult.recordset[0];
      if (!empleado) continue;

      const tipoMovResult = await conexion.request()
        .input("inNombreTipoMovimiento", sql.VarChar(128), nombreTipoMovimiento)
        .output("outResultCode", sql.Int)
        .execute("usp_ObtenerTipoMovimientoPorNombre");

      const tipoMovimiento = tipoMovResult.recordset[0];
      if (!tipoMovimiento) continue;

      const saldoActual = empleado.SaldoVacaciones;
      let nuevoSaldo;

      if (tipoMovimiento.TipoAccion === "Credito") {
        nuevoSaldo = saldoActual + parseFloat(mov.$.Monto);
      } else {
        nuevoSaldo = saldoActual - parseFloat(mov.$.Monto);
      }

      await conexion.request()
        .input("inValorDocumentoIdentidad", sql.VarChar(16), mov.$.ValorDocId)
        .input("inNombreTipoMovimiento", sql.VarChar(128), nombreTipoMovimiento)
        .input("inFecha", sql.Date, new Date(mov.$.Fecha))
        .input("inMonto", sql.Float, parseFloat(mov.$.Monto))
        .input("inNuevoSaldo", sql.Float, nuevoSaldo)
        .input("inPostByUser", sql.VarChar(128), mov.$.PostByUser)
        .input("inPostInIP", sql.VarChar(128), mov.$.PostInIP)
        .input("inPostTime", sql.DateTime, new Date(mov.$.PostTime))
        .output("outResultCode", sql.Int)
        .execute("usp_InsertarMovimiento");
    }
  }

  console.log("Carga de XML completada exitosamente.");
}

module.exports = {
  cargarDatosXml
};
