const { Ubicacion, Usuario } = require("../models");

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

const obtenerUbicacionesPorUsuario = async (req, res = response) => {
  const usuarioId = req.uid;
  try {
    const ubicaciones = await Ubicacion.find({ usuario: usuarioId });
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

const agregarUbicacion = async (req, res = response) => {
  const usuarioId = req.uid;
  const ubicacionId = req.params.id;

  try {
    const usuario = await Usuario.findById(usuarioId);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }

    const ubicacion = await Ubicacion.findById(ubicacionId);

    if (!ubicacion) {
      return res.status(404).json({
        ok: false,
        msg: "Ubicación no encontrada",
      });
    }

    // Verificar si la ubicación ya está asociada al usuario
    if (usuario.ubicaciones.includes(ubicacionId)) {
      return res.status(400).json({
        ok: false,
        msg: "La ubicación ya está asociada al usuario",
      });
    }

    // Agregar la ubicación al usuario
    usuario.ubicaciones.push(ubicacionId);
    await usuario.save();

    res.json(
      ubicacion,
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

//delete ubicacion por id
const eliminarUbicacion = async (req, res = response) => {
  const usuarioId = req.uid;
  const ubicacionId = req.params.id;

  try {
    const usuario = await Usuario.findById(usuarioId);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }

    // Verificar si la ubicación está asociada al usuario
    if (!usuario.ubicaciones.includes(ubicacionId)) {
      return res.status(400).json({
        ok: false,
        msg: "La ubicación no está asociada al usuario",
      });
    }

    // Eliminar la ubicación del usuario
    await Usuario.findByIdAndUpdate(usuarioId, {
      $pull: { ubicaciones: ubicacionId },
    });

    res.json({
      ok: true,
      msg: "Ubicación eliminada del usuario exitosamente",
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
  obtenerUbicacionesPorUsuario,
  agregarUbicacion,
  eliminarUbicacion,
};
