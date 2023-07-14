const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");

const {
  actualizarUsuario,
  ageregarTelefonos,
  agregarDireccion,
  agregarTelefono,
  eliminarTelefono,
  enviarNotificacionesArrayTelefonos,
  getUsuarios,
  actualizarTelefonoOrNombre,
} = require("../controllers/usuarios");

const router = Router();

router.delete("/delete-telefono", validarJWT, eliminarTelefono );
router.get("/", validarJWT, getUsuarios);
router.post("/notificacion", validarJWT, enviarNotificacionesArrayTelefonos);
router.put("/", validarJWT, actualizarUsuario);
router.put("/add-direccion", validarJWT, agregarDireccion);
router.put("/add-telefono", validarJWT, agregarTelefono );
router.put("/add-telefonos", validarJWT, ageregarTelefonos );
router.put("/add-telefono-nombre", validarJWT, actualizarTelefonoOrNombre );

module.exports = router;
