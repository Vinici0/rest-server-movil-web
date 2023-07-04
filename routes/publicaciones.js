const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  obtenerPublicacionesUsuario,
  guardarPublicacion,
  getPublicacionesEnRadio,
  updatePublicacion,
  likePublicacion,
  guardarListArchivo,
} = require("../controllers/publicaciones");
const { validarCampos } = require("../middlewares/validar-campos");
const { validacionesCrearPublicacion } = require("../middlewares/express-validator");

const router = Router();

router.get("/", validarJWT, obtenerPublicacionesUsuario);

router.get("/cercanas", validarJWT, getPublicacionesEnRadio);


router.put("/like2/:id", validarJWT, likePublicacion);

router.post("/", [...validacionesCrearPublicacion, validarCampos, validarJWT], guardarPublicacion);

router.put("/:id", validarJWT, updatePublicacion);

router.post("/listaArchivos/:uid/:titulo",validarCampos, guardarListArchivo);

router.put("/like", validarJWT, updatePublicacion);

module.exports = router;
