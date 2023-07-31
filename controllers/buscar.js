const { response, request } = require("express");
const { ObjectId } = require("mongoose").Types;

const {
  Comentario,
  Mensaje,
  Publicacion,
  Sala,
  Ubicacion,
  Usuario,
} = require("../models");

const coleccionesPermitidas = [
  "usuarios",
  "publicaciones",
  "comentarios",
  "mensajes",
  "salas",
  "ubicaciones",
];

const buscarUsuarios = async (termino = "", res = response) => {
  const esMongoID = ObjectId.isValid(termino);

  if (esMongoID) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: usuario ? [usuario] : [],
    });
  }

  const regex = new RegExp(termino, "i");

  const usuarios = await Usuario.find({
    $or: [{ nombre: regex }, { apellido: regex }, { email: regex }],
    $and: [{ estado: true }],
  });

  res.json({
    results: usuarios,
  });
};

const buscarUbicaciones = async (
  termino = "",
  res = response,
  req = request
) => {
  const esMongoID = ObjectId.isValid(termino);
  if (esMongoID) {
    const ubicacion = await Ubicacion.findById(termino);
    return res.json({
      ubicaciones: ubicacion ? [ubicacion] : [],
    });
  }

  const { limite = 6, desde = 0 } = req.query;
  const regex = new RegExp(termino, "i");

  const ubicaciones = await Ubicacion.find({
    $or: [
      { barrio: regex },
      { ciudad: regex },
      { parroquia: regex },
      { pais: regex },
      { referencia: regex },
    ],
    $and: [{ estado: true }],
  })
    .skip(Number(desde))
    .limit(Number(limite));

  res.json({
    ok: true,
    ubicaciones: ubicaciones,
  });
};

const buscar = async (req = request, res = response) => {
  const { coleccion, termino } = req.params;
  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "usuarios":
      buscarUsuarios(termino, res);
      break;
    case "ubicaciones":
      buscarUbicaciones(termino, res, req);
      break;
    default:
      res.status(500).json({
        msg: "Se le olvidó hacer esta búsqueda",
      });
  }
};

module.exports = { buscar };
