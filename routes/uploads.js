
const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarArchivoSubir } = require('../middlewares/validar-archivo');
const { cargarArchivo, mostrarImagen, mostrarAllImagenes } = require('../controllers/uploads');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

router.post( '/', validarArchivoSubir, cargarArchivo );

router.get('/:coleccion/:id', [
    check('id','El id debe de ser de mongo').isMongoId(),
    // check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','publicaciones'] ) ),
    validarCampos
], mostrarImagen  )

router.get('/imagenes/:coleccion/:id', mostrarImagen  )

module.exports = router;
