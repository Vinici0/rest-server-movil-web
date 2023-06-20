const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarCampos } = require("../middlewares/validar-campos");
const { obtenerUbicaciones, crearUbicacion, obtenerUbicacionesPorUsuario, actualizarUbicacionPorUsuario, agregarUbicacion } = require("../controllers/ubicaciones");
const { validacionesUbicacion } = require("../middlewares/express-validator");

const router = Router();

router.get("/", obtenerUbicaciones);

router.post("/", [
    validacionesUbicacion,
    validarCampos, 
  ], crearUbicacion);

router.get("/", validarJWT, obtenerUbicacionesPorUsuario);

router.put("/:id", validarJWT, agregarUbicacion);
module.exports = router;
