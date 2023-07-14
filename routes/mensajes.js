/*
    Path: /api/mensajes
*/
const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');

const { getAllMessages, getMensajeByUser, getMensajeByRoom } = require('../controllers/mensajes');

const router = Router();


// router.get('/:de', validarJWT, obtenerChat );

router.get('/', validarJWT, getAllMessages );

// getMensajeByUser
router.get('/get-mensaje-by-user', validarJWT, getMensajeByUser );

//get mensajes de sala
router.get('/get-mensaje-by-room/:salaId', validarJWT, getMensajeByRoom );

module.exports = router;


