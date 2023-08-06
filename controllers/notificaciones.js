const { Notificacion } = require("../models");

const obtenerNotificacionesUsuario = async (req, res) => {
  const usuarioId = req.uid;
  try {
    //populate para traer los datos del usuario que envia la notificacion
    const notificaciones = await Notificacion.find({
      usuario: usuarioId,
    })
      .populate(
        "publicacion",
        "titulo contenido color ciudad barrio isPublic usuario imagenes imgAlerta latitud longitud nombreUsuario likes isLiked createdAt"
      )
      .populate("usuarioRemitente", "nombre img telefono email google").sort({createdAt: -1});

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
      publicacion: tipo === "publicacion" ? relacionadoId : null,
      telefonoDestino: tipo === "sos"
       ? telefonoUsuario : null,
      mensaje,
      latitud,
      longitud,
      usuarioRemitente
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
