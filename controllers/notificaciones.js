const { Notificacion } = require("../models");

const obtenerNotificacionesUsuario = async (req, res) => {
  const usuarioId = req.uid;
  try {
    //populate para traer los datos del usuario que envia la notificacion
    const notificaciones = await Notificacion.find({
      usuarioDestino: usuarioId,
    })
      .populate(
        "publicacion",
        "titulo contenido color ciudad barrio isPublic usuario imagenes imgAlerta latitud longitud nombreUsuario"
      )
      .populate("usuario", "nombre img telefono email");

    res.json({
      ok: true,
      notificaciones,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const marcarNotificacionComoLeida = async (req, res) => {
  const usuarioId = req.uid;
  const notificacionId = req.params.id;

  try {
    const notificacion = await Notificacion.findById(notificacionId);

    if (!notificacion) {
      return res.status(404).json({ mensaje: "Notificación no encontrada" });
    }

    notificacion.leidaPorUsuario.push({ usuario: usuarioId, leida: true });
    await notificacion.save();

    res.json({
      ok: true,
      mensaje: "Notificación marcada como leída",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

// Controlador para guardar una nueva notificación
const guardarNotificacion = async (
  tipo,
  usuario,
  mensaje,
  relacionadoId = null,
  telefonoUsuario = null
) => {
  try {
    const notificacion = new Notificacion({
      tipo,
      usuario,
      publicacion: tipo === "publicacion" ? relacionadoId : null,
      telefonoDestino: tipo === "sos" ? telefonoUsuario : null,
      mensaje,
    });

    await notificacion.save();

    // Aquí puedes realizar acciones adicionales relacionadas con la notificación, si es necesario

    return notificacion;
  } catch (error) {
    console.log(error);
    throw new Error("Error al guardar la notificación");
  }
};

module.exports = {
  obtenerNotificacionesUsuario,
  guardarNotificacion,
  marcarNotificacionComoLeida,
};
