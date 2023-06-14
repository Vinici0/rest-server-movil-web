const { check } = require("express-validator");
const validacionesCrearPublicacion = [
  check("barrio", "El barrio es obligatorio").not().isEmpty(),
  check("ciudad", "La ciudad es obligatoria").not().isEmpty(),
  check("color", "El color es obligatorio").not().isEmpty(),
  check("contenido", "El contenido es obligatorio").not().isEmpty(),
  check("isPublic", "El estado de publicación es obligatorio").not().isEmpty(),
  check("latitud", "La latitud es obligatoria").not().isEmpty(),
  check("longitud", "La longitud es obligatoria").not().isEmpty(),
  check("titulo", "El título es obligatorio").not().isEmpty(),
];

const validacionesUbicacion = [
  check("barrio", "El barrio es obligatorio").not().isEmpty(),
  check("ciudad", "La ciudad es obligatoria").not().isEmpty(),
  check("latitud", "La latitud es obligatoria").not().isEmpty(),
  check("longitud", "La longitud es obligatoria").not().isEmpty(),
  check("pais", "El país es obligatorio").not().isEmpty(),
];


module.exports = {
  validacionesCrearPublicacion,
  validacionesUbicacion,
};
