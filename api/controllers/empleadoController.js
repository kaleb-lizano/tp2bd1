const sql = require("mssql");
const config = require("../config");

async function obtenerEmpleados(req, res, next) {
  try {
    const conexion = await sql.connect(config.sql);
    const resultado = await conexion
      .request()
      .output("outResultCode", sql.Int)
      .execute("usp_ObtenerEmpleadosAscendente");

    const outResultCode = resultado.output.outResultCode;

    if (outResultCode === 50001) {
      return res.status(500).json({
        message: "Error interno en la base de datos al obtener los empleados.",
      });
    }

    res.status(200).json(resultado.recordset || []);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function insertarEmpleado(req, res, next) {
  try {
    const { nombre, salario } = req.body;
    const conexion = await sql.connect(config.sql);

    const resultado = await conexion
      .request()
      .input("inNombre", sql.VarChar(128), nombre)
      .input("inSalario", sql.Money, salario)
      .output("outResultCode", sql.Int)
      .execute("usp_InsertarEmpleado");

    const outResultCode = resultado.output.outResultCode;

    if (outResultCode === 50001) {
      return res.status(409).json({
        message: "El nombre del empleado ya existe.",
      });
    }

    if (outResultCode === 50002) {
      return res.status(500).json({
        message: "Error en la base de datos al insertar el empleado.",
      });
    }

    res.status(201).json({ message: "Empleado agregado exitosamente" });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

module.exports = {
  obtenerEmpleados,
  insertarEmpleado,
};
