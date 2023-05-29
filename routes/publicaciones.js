const { Router } = require('express'); 
const { validarJWT } = require('../middlewares/validar-jwt');
const { obtenerPublicacionesUsuario, guardarPublicacion,  getPublicacionesEnRadio, guardarListArchivo, updatePublicacion, likePublicacion2, likePublicacion } = require('../controllers/publicaciones');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

router.get("/", validarJWT, obtenerPublicacionesUsuario);

router.get("/cercanas", validarJWT, getPublicacionesEnRadio);

//likePublicacion2
router.put("/like2/:id", validarJWT, likePublicacion);

router.post("/", validarJWT, guardarPublicacion);

router.post("/listaArchivos/:uid/:titulo",validarCampos, guardarListArchivo);

//updatePublicacion
router.put("/:id", validarJWT, updatePublicacion);

//toggleLikePublicacion
router.put("/like", validarJWT, updatePublicacion);

module.exports = router;