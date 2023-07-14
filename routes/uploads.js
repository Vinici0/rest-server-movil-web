const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarArchivoSubir } = require("../middlewares/validar-archivo");
const {
  cargarArchivo,
  mostrarImagen,
  mostrarAllImagenes,
  actualizarImagen,
  mostrarImagenUsuario,
} = require("../controllers/uploads");
const { validarCampos } = require("../middlewares/validar-campos");
const { coleccionesPermitidas } = require("../helpers/db-validator");

const router = Router();

router.post("/", validarArchivoSubir, cargarArchivo);

router.get(
  "/:coleccion/:id",
  [
    check("id", "El id debe de ser de mongo").isMongoId(),
    // check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','publicaciones'] ) ),
    validarCampos,
  ],
  mostrarImagen
);

router.get(
  "/usuario/:coleccion/:id",
  [
    check("id", "El id debe de ser de mongo").isMongoId(),
    // check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','publicaciones'] ) ),
    validarCampos,
  ],
  mostrarImagenUsuario
);


router.get("/imagenes/:coleccion/:id", mostrarImagen);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id','El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','publicaciones'] ) ),
    validarCampos
], actualizarImagen  )

module.exports = router;
