const { Router } = require("express");
const {
  obtenerCiudades,obtenerBarrios,obtenerEmergencias,obtenerReporteBarras,obtenerReportePastel,obtenerAnios
} = require("../controllers/reportes");

const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();
router.get(
  "/obtenerCiudades",
  /* validarJWT, */
  obtenerCiudades
);
router.post(
  "/obtenerBarrios",
/*   validarJWT, */
  obtenerBarrios
);
router.post(
  "/obtenerEmergencias",
/*   validarJWT, */
  obtenerEmergencias
);
router.post(
  "/obtenerReporteBarras",
/*   validarJWT, */
  obtenerReporteBarras
);
router.post(
  "/obtenerReportePastel",
/*   validarJWT, */
obtenerReportePastel
);
router.post(
  "/obtenerAnios",
/*   validarJWT, */
obtenerAnios
);

module.exports = router;
