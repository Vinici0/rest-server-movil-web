const {
  Publicacion,
  Sala,
  Mensaje,
  Usuario,
  Comentario,
} = require("../models");

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

const grabarMensaje = async (payload) => {
  // payload: {
  //     de: '',
  //     para: '',
  //     texto: ''
  // }

  try {
    console.log(payload);
    const mensaje = new Mensaje(payload);
    await mensaje.save();

    return true;
  } catch (error) {
    return false;
  }
};

const grabarMensajeSala2 = async (payload) => {
  try {
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

const grabarMensajeSala = async (payload) => {
  try {
    const { mensaje, de, para } = payload;
    console.log(payload);
    const newMessage = new Mensaje({ mensaje, usuario: de });
    await newMessage.save();

    const sala = await Sala.findById(para);
    sala.mensajes.push(newMessage._id);
    await sala.save();

    const usuariosEnGrupoOffline = await obtenerUsuariosSalaHelper(para);

    // Actualizar la cantidad de mensajes no leídos solo para los usuarios offline en el grupo
    for (const usuario of usuariosEnGrupoOffline) {
      // Skip the sender of the message from having their mensajesNoLeidos incr emented
      if (usuario._id.toString() === de) {
        continue;
      }

      //actualizar isSalasPendiente a true
      usuario.isSalasPendiente = true;

      usuario.salas = usuario.salas.map((sala) => {
        if (sala.salaId.toString() === para) {
          sala.mensajesNoLeidos++;
          sala.ultimaVezActivo = new Date();
        }

        return sala;
      });

      await usuario.save();
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const obtenerUsuariosSalaHelper = async (salaId) => {
  try {
    const usuariosEnSala = await Usuario.find({
      "salas.salaId": salaId,
      "salas.isRoomOpen": false,
    });
    return usuariosEnSala;
  } catch (error) {
    console.log(error);
    return [];
  }
};
//grabarComentarioPublicacion
// const grabarComentarioPublicacion = async (payload) => {
//   try {
//     const { mensaje, usuario, publicacion } = payload;

//     // Crear el comentario
//     const comentario = new Comentario({
//       mensaje,
//       usuario,
//       publicacion,
//       estado: "publicado",
//     });

//     // Guardar el comentario en la base de datos
//     await comentario.save();

//     // Agregar el comentario a la publicación
//     const publicacionActualizada = await Publicacion.findByIdAndUpdate(
//       publicacion,
//       { $push: { comentarios: comentario._id } },
//       { new: true }
//     );

//     return true;
//   } catch (error) {
//     console.log(error);
//     return false;
//   }
// };

const grabarComentarioPublicacion = async (payload) => {
  const usuarioId = payload.de;
  try {
    const { mensaje, para } = payload;

    const publicacion = await Publicacion.findById(para);
    if (!publicacion) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    const comentario = new Comentario({
      contenido: mensaje,
      usuario: usuarioId,
      publicacion: para,
      estado: "publicado",
    });

    await comentario.save();

    publicacion.comentarios.push(comentario._id);
    await publicacion.save();

    return comentario._id.toString();
  } catch (error) {
    console.error(error);
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
