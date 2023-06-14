const { Publicacion, Sala, Mensaje, Usuario } = require("../models");

const usuarioConectado = async (uid = "") => {
  if (!uid) return null;

  const usuario = await Usuario.findById(uid);
  if (!usuario) return null;

  usuario.online = true;
  await usuario.save();
  return usuario;
};

const usuarioDesconectado = async (uid = "") => {
  if (!uid) return null;

  const usuario = await Usuario.findById(uid);
  if (!usuario) return null; 
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

//grabarComentarioPublicacion
const grabarComentarioPublicacion = async (payload) => {
  try {
    const { contenido, usuario, publicacion } = payload;

    // Crear el comentario
    const comentario = new Comentario({
      contenido,
      usuario,
      publicacion,
      estado: "publicado",
    });

    // Guardar el comentario en la base de datos
    await comentario.save();

    // Agregar el comentario a la publicación
    const publicacionActualizada = await Publicacion.findByIdAndUpdate(
      publicacion,
      { $push: { comentarios: comentario._id } },
      { new: true }
    );

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
  grabarComentarioPublicacion,
};
