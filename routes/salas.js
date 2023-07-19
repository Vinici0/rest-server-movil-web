const { Router } = require("express");
const {
  crearSala,
  grabarMensajeSala,
  getSalas,
  unirseSala,
  obtenerSalasMensajesUsuario,
  getMensajesBySala,
  getMensajesSala,
  updateSala,
  deleteSala,
  obtenerUsuariosSala,
  deleteUserById,
  getSalasByUser,
  abandonarSala,
} = require("../controllers/salas");

const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.post("/", validarJWT, crearSala);

router.get("/", getSalas);

router.put("/:salaId", updateSala);

router.delete("/:salaId", deleteSala);

router.post("/grabar-mensaje", validarJWT, grabarMensajeSala);

router.post("/unir-sala", validarJWT, unirseSala);

router.get(
  "/obtener-salas-mensajes-usuario",
  validarJWT,
  obtenerSalasMensajesUsuario
);

router.get("/obtener-salas-usuario", validarJWT, getSalasByUser);

router.get("/get-mensajes-by-sala/:salaId", validarJWT, getMensajesBySala);

router.get("/get-mensajes-sala/:salaId", validarJWT, getMensajesSala);

router.get("/obtener-usuarios-sala/:salaId", validarJWT, obtenerUsuariosSala);

router.delete("/delete-user/:salaId/:usuarioId", validarJWT, deleteUserById);

router.delete("/abandonar-sala/:salaId", validarJWT, abandonarSala);

module.exports = router;
