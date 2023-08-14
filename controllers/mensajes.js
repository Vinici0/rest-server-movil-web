const { Usuario, Sala, Mensaje } = require("../models");

const getMensajeByUser = async (req, res) => {
  const miId = req.uid;

  const mensajes = await Mensaje.find({
    usuario: miId,
  });

  res.json({
    ok: true,
    mensajes,
  });
};

const getAllMessages = async (req, res) => {
  const messages = await Mensaje.find();
  res.json({
    ok: true,
    messages,
  });
};

const getMensajeByRoom = async (req, res) => {
  const { salaId } = req.params;
  const { limite = 50, desde = 0 } = req.query;
  const usuarioId = req.uid;

  try {
    const sala = await Sala.findById(salaId)
      .populate({
        path: "mensajes",
        options: {
          skip: Number(desde),
          limit: Number(limite),
          sort: { createdAt: -1 },
        },
      })
      .lean();

    const mensajesSala = await Promise.all(
      sala.mensajes.map(async (mensaje) => {

        const usuarioMensaje = await Usuario.findById(mensaje.usuario);

        mensaje = { ...mensaje, nombre: usuarioMensaje.nombre, img: usuarioMensaje.img, isGoogle: usuarioMensaje.google };
        return mensaje;
      })
    );

    const usuario = await Usuario.findById(usuarioId);

    // Encontrar la entrada correspondiente en la lista de salas del usuario para la sala específica
    const salaUsuario = usuario.salas.find((salaUsuario) => salaUsuario.salaId.toString() === salaId);

    // Reiniciar el contador de mensajes no leídos (mensajesNoLeidos) a cero para esa entrada
    if (salaUsuario) {
      salaUsuario.mensajesNoLeidos = 0;
      await usuario.save(); 
    }

    res.json({
      ok: true,
      mensajesSala,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};



const getMensajeByRoom2 = async (req, res) => {
  const { salaId } = req.params;
  const { limite = 50, desde = 0 } = req.query;
  const miId = req.uid;

  try {
    const sala = await Sala.findById(salaId)
      .populate({
        path: "mensajes",
        options: {
          skip: Number(desde),
          limit: Number(limite),
          sort: { createdAt: -1 },
        },
      })
      .lean();

    const mensajesSala = await Promise.all(
      sala.mensajes.map(async (mensaje) => {
        const usuarioMensaje = await Usuario.findById(mensaje.usuario);
        mensaje = { ...mensaje, nombre: usuarioMensaje.nombre, img: usuarioMensaje.img, isGoogle: usuarioMensaje.google };
        return mensaje;
      })
    );

    // Marcar los mensajes de la sala como leídos por el usuario
    const mensajesIds = mensajesSala.map((mensaje) => mensaje._id);
    await Mensaje.updateMany(
      { _id: { $in: mensajesIds }, leidoPor: { $ne: miId } },
      { $addToSet: { leidoPor: miId } }
    );

    res.json({
      ok: true,
      mensajesSala,
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
  getAllMessages,
  getMensajeByUser,
  getMensajeByRoom,
};
