const { Router } = require('express'); 
const { crearSala, grabarMensajeSala, getSalas, unirseSala, obtenerSalasMensajesUsuario, getSalesByUser, getMensajesBySala, getMensajesSala } = require('../controllers/salas');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/', validarJWT,crearSala);

//getSalas
router.get('/', getSalas);

//grabarMensajeSala
router.post('/grabar-mensaje', validarJWT, grabarMensajeSala);

//unir a sala
router.post('/unir-sala', validarJWT, unirseSala);

//obtenerSalasMensajesUsuario
router.get('/obtener-salas-mensajes-usuario', validarJWT, obtenerSalasMensajesUsuario);

//obtenerSalasUsuario
router.get('/obtener-salas-usuario', validarJWT, getSalesByUser);


//getMensajesBySala
router.get('/get-mensajes-by-sala/:salaId', validarJWT, getMensajesBySala);

//getMensajesSala 
router.get('/get-mensajes-sala/:salaId', validarJWT, getMensajesSala);



module.exports = router;