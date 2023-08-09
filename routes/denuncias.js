const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

const { validarCampos } = require("../middlewares/validar-campos");
const { guardarDenuncia } = require("../controllers/denuncias");

router.post( "/", [
    check("publicacionId", "El id de la publicación es obligatorio").not().isEmpty(),
    check("motivo", "El motivo es obligatorio").not().isEmpty(),
    validarCampos,
    validarJWT,
], guardarDenuncia );

module.exports = router;