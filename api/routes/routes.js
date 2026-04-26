"use strict";

const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const empleadoController = require("../controllers/empleadoController");

router.post("/auth/login", authController.login);
router.post("/auth/logout", authController.logout);

router.post("/empleados", empleadoController.insertarEmpleado);
router.get("/empleados", empleadoController.obtenerEmpleados);
router.get("/empleados/:valorDocumento", empleadoController.consultarEmpleado);
router.put("/empleados/:valorDocumento", empleadoController.actualizarEmpleado);
router.post(
	"/empleados/:valorDocumento/eliminar",
	empleadoController.eliminarEmpleado,
);

module.exports = {
	routes: router,
};
