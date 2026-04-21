"use strict";

const express = require("express");
const empleadoController = require("../controllers/empleadoController");
const router = express.Router();

const { obtenerEmpleados, insertarEmpleado } = empleadoController;

router.get("/empleados/obtenerEmpleados", obtenerEmpleados);
router.post("/empleados/insertarEmpleado", insertarEmpleado);

module.exports = {
	routes: router,
};
