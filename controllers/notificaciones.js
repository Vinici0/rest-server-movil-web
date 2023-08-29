const { Notificacion } = require("../models");

const obtenerNotificacionesUsuario = async (req, res) => {
  const usuarioId = req.uid;
  const { limite = 10, desde = 0 } = req.query;

  try {
    const notificaciones = await Notificacion.find({
      usuario: usuarioId,
    })
      .populate(
        "publicacion",
        "titulo contenido color ciudad barrio isPublic usuario likes imagenes latitud longitud comentarios imgAlerta isLiked createdAt updatedAt nombreUsuario isPublicacionPendiente"
      )
      .populate("usuarioRemitente", "nombre img telefono email google")
      .sort({ createdAt: -1 })
      .skip(Number(desde))
      .limit(Number(limite));

    //que solo

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

    notificacion.isLeida = true;

    await notificacion.save();

    res.json({
      ok: true,
      notificacion,
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
  telefonoUsuario = null,
  latitud,
  longitud,
  usuarioRemitente
) => {
  console.log("usuarioRemitente", usuarioRemitente);
  try {
    console.log(telefonoUsuario);
    const notificacion = new Notificacion({
      tipo,
      usuario,
      publicacion: tipo === "publicacion" || tipo === "mensaje" ? relacionadoId : null,
      telefonoDestino: tipo === "sos" ? telefonoUsuario : null,
      mensaje,
      latitud,
      longitud,
      usuarioRemitente,
    });

    await notificacion.save();

    // Aquí puedes realizar acciones adicionales relacionadas con la notificación, si es necesario

    return notificacion;
  } catch (error) {
    console.log(error);
    throw new Error("Error al guardar la notificación");
  }
};

//deleteAllNotifications
const deleteAllNotifications = async (req, res) => {
  const usuarioId = req.uid;

  try {
    const notificaciones = await Notificacion.deleteMany({
      usuario: usuarioId,
    });

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

//deleteNotificationById
const deleteNotificationById = async (req, res) => {
  const usuarioId = req.uid;
  const notificacionId = req.params.id;

  try {
    const notificacion = await Notificacion.findById(notificacionId);

    if (!notificacion) {
      return res.status(404).json({ mensaje: "Notificación no encontrada" });
    }

    await notificacion.delete();

    res.json({
      ok: true,
      notificacion,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",

    });
  }
};

module.exports = {
  obtenerNotificacionesUsuario,
  guardarNotificacion,
  marcarNotificacionComoLeida,
  deleteAllNotifications,
  deleteNotificationById,
};
