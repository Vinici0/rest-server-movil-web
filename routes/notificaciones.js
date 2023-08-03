const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar-jwt");
const { obtenerNotificacionesUsuario, marcarNotificacionComoLeida } = require("../controllers/notificaciones");

const router = Router();

router.get("/", validarJWT, obtenerNotificacionesUsuario);

router.put("/:id", validarJWT, marcarNotificacionComoLeida);
    
module.exports = router;