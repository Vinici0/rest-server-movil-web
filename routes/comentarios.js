const { Router } = require('express'); 
const { validarJWT } = require('../middlewares/validar-jwt');
const { getComentariosByPublicacion, createComentario } = require('../controllers/comentarios');

const router = Router();

router.get("/:publicacionId", validarJWT, getComentariosByPublicacion);

router.post("/", validarJWT, createComentario);

module.exports = router;