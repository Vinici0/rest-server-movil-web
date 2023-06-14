const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");

const {
  getUsuarios,
  actualizarUsuario,
  agregarDireccion,
} = require("../controllers/usuarios");

const router = Router();

router.get("/", validarJWT, getUsuarios);

router.put("/", validarJWT, actualizarUsuario);

router.put("/add-direccion", validarJWT, agregarDireccion);

module.exports = router;
