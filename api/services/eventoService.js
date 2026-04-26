const sql = require("mssql");
const config = require("../config");

async function registrarEvento(
	idTipoEvento,
	descripcion,
	idUsuario,
	ip,
	postTime = null,
) {
	try {
		const time = postTime ? new Date(postTime) : new Date();

		const conexion = await sql.connect(config.sql);
		await conexion
			.request()
			.input("inIdTipoEvento", sql.Int, idTipoEvento)
			.input("inDescripcion", sql.Text, descripcion)
			.input("inIdPostByUser", sql.Int, idUsuario || 1)
			.input("inPostInIP", sql.VarChar(128), ip || "127.0.0.1")
			.input("inPostTime", sql.DateTime, time)
			.output("outResultCode", sql.Int)
			.execute("usp_RegistrarEvento");
	} catch (error) {
		console.error("Error al registrar evento en bitácora:", error);
	}
}

module.exports = {
	registrarEvento,
};
