"use strict";

const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const empleadoController = require("../controllers/empleadoController");
const movimientoController = require("../controllers/movimientoController");
const catalogoController = require("../controllers/catalogoController");
const xmlController = require("../controllers/xmlController");

router.post("/auth/login", authController.login);
router.post("/auth/logout", authController.logout);

router.get("/empleados", empleadoController.obtenerEmpleados);
router.get("/empleados/:valorDocumento", empleadoController.consultarEmpleado);
router.post("/empleados", empleadoController.insertarEmpleado);
router.put("/empleados/:valorDocumento", empleadoController.actualizarEmpleado);
router.post("/empleados/:valorDocumento/eliminar", empleadoController.eliminarEmpleado);

router.get("/movimientos/:valorDocumento", movimientoController.obtenerMovimientos);
router.post("/movimientos/:valorDocumento", movimientoController.insertarMovimiento);

router.get("/catalogos/puestos", catalogoController.obtenerPuestos);
router.get("/catalogos/tiposMovimiento", catalogoController.obtenerTiposMovimiento);
router.get("/catalogos/error/:codigo", catalogoController.obtenerError);

router.post("/admin/cargar-xml", xmlController.cargarXML);

module.exports = {
	routes: router,
};
