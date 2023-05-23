const { Router } = require('express'); 
const { validarJWT } = require('../middlewares/validar-jwt');
const { obtenerPublicacionesUsuario, guardarPublicacion,  getPublicacionesEnRadio, guardarListArchivo } = require('../controllers/publicacion');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

router.get("/", validarJWT, obtenerPublicacionesUsuario);

router.get("/cercanas", validarJWT, getPublicacionesEnRadio);

router.post("/", validarJWT, guardarPublicacion);

router.post("/listaArchivos/:uid/:titulo",validarCampos, guardarListArchivo);

module.exports = router;