const Usuario = require("../models/usuario");
const Mensaje = require("../models/mensaje");
const Sala = require("../models/sala");

const usuarioConectado = async (uid = "") => {
  const usuario = await Usuario.findById(uid);
  usuario.online = true;
  await usuario.save();
  return usuario;
};

const usuarioDesconectado = async (uid = "") => {
  const usuario = await Usuario.findById(uid);
  usuario.online = false;
  await usuario.save();
  return usuario;
};

// payload: {

const grabarMensaje = async (payload) => {
  // payload: {
  //     de: '',
  //     para: '',
  //     texto: ''
  // }

  try {
    console.log("grabarMensaje");
    console.log(payload);
    const mensaje = new Mensaje(payload);
    await mensaje.save();

    return true;
  } catch (error) {
    return false;
  }
};

// const grabarMensajeSala = async (req, res) => {
//   try {
//     const { mensaje, salaId } = req.body;
//     const usuarioId = req.uid;

//     // Create new message
//     const newMessage = new Mensaje({ mensaje, usuario: usuarioId });
//     await newMessage.save();

//     // Add message to room
//     const sala = await Sala.findById(salaId);
//     sala.mensajes.push(newMessage._id);
//     await sala.save();

//     res.json({
//       ok: true,
//       sala,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       ok: false,
//       msg: "Por favor hable con el administrador",
//     });
//   }
// };

//id sala - id usuario - texto de mensaje
const grabarMensajeSala = async (payload) => {
  try {
    console.log(payload);
    const { mensaje, de, para } = payload;
    const sala = await Sala.findById(para);

    const newMessage = new Mensaje({ mensaje, usuario: de });
    await newMessage.save();

    sala.mensajes.push(newMessage._id);
    await sala.save();

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};




module.exports = {
  usuarioConectado,
  usuarioDesconectado,
  grabarMensaje,
  grabarMensajeSala,

};
