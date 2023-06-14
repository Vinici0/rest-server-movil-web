const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarCampos } = require("../middlewares/validar-campos");
const { obtenerUbicaciones, crearUbicacion } = require("../controllers/ubicaciones");
const { validacionesUbicacion } = require("../middlewares/express-validator");

const router = Router();

router.get("/", obtenerUbicaciones);

router.post("/", [
    validacionesUbicacion,
    validarCampos, 
  ], crearUbicacion);

module.exports = router;
