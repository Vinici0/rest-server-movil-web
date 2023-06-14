const {Ubicacion} = require("../models");

const crearUbicacion = async (req, res = response) => {
  try {
    const ubicacion = new Ubicacion(req.body);
    await ubicacion.save();
    res.json({
      ok: true,
      ubicacion,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const obtenerUbicaciones = async (req, res = response) => {
  try {
    const ubicaciones = await Ubicacion.find();
    res.json({
      ok: true,
      ubicaciones,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

module.exports = {
  crearUbicacion,
  obtenerUbicaciones,
};
