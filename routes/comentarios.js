const { Router } = require('express'); 
const { validarJWT } = require('../middlewares/validar-jwt');
const { getComentariosByPublicacion, createComentario, toggleLikeComentario } = require('../controllers/comentarios');

const router = Router();

router.get("/:publicacionId", validarJWT, getComentariosByPublicacion);

router.post("/", validarJWT, createComentario);

router.put("/like/:id", validarJWT, toggleLikeComentario);

module.exports = router;