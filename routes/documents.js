const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarArchivoSubir } = require("../middlewares/validar-archivo");
const pdfTemplate = require('../prueba/public/pdfTemplate');
const router = Router();

const {createDocument,getDocument} = require('../controllers/documents');

router.post( "/", createDocument );

router.get( "/", getDocument );

module.exports = router;