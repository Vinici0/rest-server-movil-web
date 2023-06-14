const { Usuario, Sala, Mensaje } = require("../models");

const getMensajeByUser = async (req, res) => {
  const miId = req.uid;
  console.log(miId);

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
  const miId = req.uid;
  const { salaId } = req.params;

  try {
    const sala = await Sala.findById(salaId).populate("mensajes");
    const last30 = sala.mensajes.slice(-30).reverse();
    const mensajesSala = await Promise.all(
      last30.map(async (mensaje) => {
        const usuarioMensaje = await Usuario.findById(mensaje.usuario);
        mensaje = mensaje.toObject();
        mensaje.nombre = usuarioMensaje.nombre;
        return mensaje;
      })
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
