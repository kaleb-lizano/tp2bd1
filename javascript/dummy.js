/* Datos dummy: usuarios
   ===================================================== */
const usuarios = [
  { id: 1, username: "admin", password: "123" },
  { id: 2, username: "mgarrison", password: ")*2LnSr^lk" },
  { id: 3, username: "jgonzalez", password: "3YSI0Hti&I" },
  { id: 4, username: "zkelly", password: "X4US4aLam@" },
  { id: 5, username: "andersondeborah", password: "732F34xo%S" },
  { id: 6, username: "hardingmicheal", password: "himB9Dzd%_" }
];

/* Datos dummy: catálogos
   ===================================================== */
const puestos = [
  "Albañil",
  "Asistente",
  "Cajero",
  "Camarero",
  "Conductor",
  "Conserje",
  "Cuidador",
  "Fontanero",
  "Niñera",
  "Recepcionista"
].sort();

const tiposMovimiento = [
  { id: 1, nombre: "Cumplir mes", tipoAccion: "Credito" },
  { id: 2, nombre: "Bono vacacional", tipoAccion: "Credito" },
  { id: 3, nombre: "Reversion Debito", tipoAccion: "Credito" },
  { id: 4, nombre: "Disfrute de vacaciones", tipoAccion: "Debito" },
  { id: 5, nombre: "Venta de vacaciones", tipoAccion: "Debito" },
  { id: 6, nombre: "Reversion de Credito", tipoAccion: "Debito" }
];

/* Datos dummy: empleados
   ===================================================== */
let empleados = [
  {
    id: 1,
    valorDocumentoIdentidad: "6993943",
    nombre: "Kaitlyn Jensen",
    puesto: "Camarero",
    fechaContratacion: "2017-12-07",
    saldoVacaciones: 6,
    esActivo: true
  },
  {
    id: 2,
    valorDocumentoIdentidad: "1896802",
    nombre: "Robert Buchanan",
    puesto: "Albañil",
    fechaContratacion: "2020-09-20",
    saldoVacaciones: 8,
    esActivo: true
  },
  {
    id: 3,
    valorDocumentoIdentidad: "5095109",
    nombre: "Christina Ward",
    puesto: "Cajero",
    fechaContratacion: "2015-09-13",
    saldoVacaciones: 0,
    esActivo: false
  },
  {
    id: 4,
    valorDocumentoIdentidad: "8403646",
    nombre: "Bradley Wright",
    puesto: "Fontanero",
    fechaContratacion: "2020-01-27",
    saldoVacaciones: 26,
    esActivo: true
  },
  {
    id: 5,
    valorDocumentoIdentidad: "6019592",
    nombre: "Robert Singh",
    puesto: "Conserje",
    fechaContratacion: "2017-02-01",
    saldoVacaciones: 8,
    esActivo: true
  },
  {
    id: 6,
    valorDocumentoIdentidad: "4510358",
    nombre: "Ryan Mitchell",
    puesto: "Asistente",
    fechaContratacion: "2018-06-08",
    saldoVacaciones: 0,
    esActivo: false
  },
  {
    id: 7,
    valorDocumentoIdentidad: "7517662",
    nombre: "Candace Fox",
    puesto: "Asistente",
    fechaContratacion: "2013-12-17",
    saldoVacaciones: 10,
    esActivo: true
  },
  {
    id: 8,
    valorDocumentoIdentidad: "8326328",
    nombre: "Allison Murillo",
    puesto: "Asistente",
    fechaContratacion: "2020-04-19",
    saldoVacaciones: 0,
    esActivo: true
  },
  {
    id: 9,
    valorDocumentoIdentidad: "2161775",
    nombre: "Jessica Murphy",
    puesto: "Cuidador",
    fechaContratacion: "2017-04-12",
    saldoVacaciones: 2,
    esActivo: false
  },
  {
    id: 10,
    valorDocumentoIdentidad: "2918773",
    nombre: "Nancy Newton",
    puesto: "Fontanero",
    fechaContratacion: "2016-11-22",
    saldoVacaciones: 0,
    esActivo: true
  }
];

/* Datos dummy: movimientos
   ===================================================== */
let movimientos = [
  {
    id: 1,
    idEmpleado: 7,
    fecha: "2024-01-18",
    tipo: "Venta de vacaciones",
    monto: 2,
    nuevoSaldo: 10,
    usuario: "hardingmicheal",
    ip: "42.142.119.153",
    postTime: "2024-01-18 18:47:14"
  },
  {
    id: 2,
    idEmpleado: 1,
    fecha: "2024-10-31",
    tipo: "Bono vacacional",
    monto: 1,
    nuevoSaldo: 13,
    usuario: "mgarrison",
    ip: "156.92.82.57",
    postTime: "2024-10-31 12:43:18"
  },
  {
    id: 3,
    idEmpleado: 1,
    fecha: "2024-11-20",
    tipo: "Disfrute de vacaciones",
    monto: 6,
    nuevoSaldo: 6,
    usuario: "hardingmicheal",
    ip: "4.176.52.1",
    postTime: "2024-11-20 23:31:41"
  },
  {
    id: 4,
    idEmpleado: 4,
    fecha: "2024-08-25",
    tipo: "Bono vacacional",
    monto: 8,
    nuevoSaldo: 26,
    usuario: "jgonzalez",
    ip: "204.0.219.231",
    postTime: "2024-08-25 16:24:07"
  },
  {
    id: 5,
    idEmpleado: 10,
    fecha: "2024-10-30",
    tipo: "Disfrute de vacaciones",
    monto: 10,
    nuevoSaldo: 0,
    usuario: "zkelly",
    ip: "220.164.108.231",
    postTime: "2024-10-30 03:55:57"
  }
];

