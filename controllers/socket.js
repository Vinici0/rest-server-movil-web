const { enviarNotificacion } = require("../helpers/enviar-notificacion");
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
    // console.log(payload);
    const newMessage = new Mensaje({ mensaje, usuario: de });
    await newMessage.save();

    const sala = await Sala.findById(para);
    sala.mensajes.push(newMessage._id);
    await sala.save();

    const usuariosEnGrupoOffline = await obtenerUsuariosSalaHelper(para, de);

    for (const usuario of usuariosEnGrupoOffline) {
      if (usuario._id.toString() === de) {
        continue;
      }

      //actualizar isSalasPendiente a true
      usuario.isSalasPendiente = true;
      usuario.isNotificacionesPendiente = true;

      usuario.salas = usuario.salas.map((sala) => {
        if (sala.salaId.toString() === para) {
          sala.mensajesNoLeidos++;
          sala.ultimaVezActivo = new Date();
        }

        return sala;
      });

      await usuario.save();
    }

    const tokens = usuariosEnGrupoOffline.map((usuario) => usuario.tokenApp);
    const titulo = "Nuevo mensaje";
    const desc = `Tienes un nuevo mensaje en el grupo ${sala.nombre}`;

    const data = {
      salaId: sala._id,
      nombre: sala.nombre,
      mensajesNoLeidos: sala.mensajesNoLeidos,
      ultimaVezActivo: sala.ultimaVezActivo,
      type: "sala",
    };

    const allTokens = [].concat(...tokens);
    //TODO: enviar notificación
    await enviarNotificacion(allTokens, titulo, desc, data);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const obtenerUsuariosSalaHelper = async (salaId, usuarioId) => {
  try {
    // El usuario que envía el mensaje
    const usuariosEnSala = await Usuario.find({
      "salas.salaId": salaId,
      "salas.isRoomOpen": false,
      _id: { $ne: usuarioId },
    });

    return usuariosEnSala;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const grabarComentarioPublicacion = async (payload) => {
  console.log(payload);
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
