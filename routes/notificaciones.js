const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar-jwt");
const { obtenerNotificacionesUsuario, marcarNotificacionComoLeida, deleteAllNotifications, deleteNotificationById } = require("../controllers/notificaciones");

const router = Router();

router.get("/", validarJWT, obtenerNotificacionesUsuario);

router.put("/:id", validarJWT, marcarNotificacionComoLeida);

router.delete("/", validarJWT, deleteAllNotifications);

router.delete("/:id", validarJWT, deleteNotificationById);
    
module.exports = router;