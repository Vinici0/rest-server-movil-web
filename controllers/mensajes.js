const Mensaje = require("../models/mensaje");
const Sala = require("../models/sala");
const Usuario = require("../models/usuario");

const getMensajeByUser = async (req, res) => {
  const miId = req.uid;
  console.log(miId);

  //Trae todo los mnesjaes por id de usuario
  const mensajes = await Mensaje.find({
    usuario: miId,
  });

  res.json({
    ok: true,
    mensajes,
  });
};


//traer todos los mensajes
const getAllMessages = async (req, res) => {
  const messages = await Mensaje.find();
  res.json({
    ok: true,
    messages,
  });
};

//getMensajeByRoom
const getMensajeByRoom = async (req, res) => {

  const miId = req.uid;
  const { salaId } = req.params;

  try {
    //traer los mensajes de la sala limitado a 30 y de forma descendente
    const sala = await Sala.findById(salaId).populate("mensajes");

    const last30 = sala.mensajes.slice(-30).reverse();

    // agregar el nombre del usuario que envió cada mensaje
    const mensajesSala = await Promise.all(last30.map(async (mensaje) => {
      const usuarioMensaje = await Usuario.findById(mensaje.usuario);
      mensaje = mensaje.toObject(); // Convertir a objeto para poder agregar propiedades
      mensaje.nombre = usuarioMensaje.nombre;
      return mensaje;
    }));
     
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
