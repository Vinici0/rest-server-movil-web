const axios = require("axios");
const { guardarNotificacion } = require("../controllers/notificaciones");

const enviarNotificacion = async (tokens, titulo, desc, usuario = {}) => {
  if (tokens.length === 0) {
    console.log("No hay tokens");
    return;
  }
  const data = {
    nombre: usuario.nombre,
    latitud: usuario.latitud,
    longitud: usuario.longitud,
    img: usuario.img,
    google: usuario.google,
  };

  try {
    const response = await axios.post(
      "https://fcm.googleapis.com/fcm/send",
      {
        notification: {
          title: titulo,
          body: desc,
        },
        priority: "high",
        data: {
          usuario: JSON.stringify(data),
        },
        registration_ids: tokens,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "key=" + process.env.TOKEN_NOTIFICAIONES,
        },
      }
    );
  } catch (error) {
    console.log(error);
    throw new Error("Error al enviar la notificación.");
  }
};

// Controlador para guardar una notificación relacionada con una publicación
const guardarNotificacionPublicacion = async (
  usuario,
  mensaje,
  publicacionId,
  latitud,
  longitud,
  usuarioRemitente
) => {
  try {
    const notificacion = await guardarNotificacion(
      "publicacion",
      usuario,
      mensaje,
      publicacionId,
      null,
      latitud,
      longitud,
      usuarioRemitente
    );

    return notificacion;
  } catch (error) {
    console.log(error);
    throw new Error("Error al guardar la notificación de publicación");
  }
};

// Controlador para guardar una notificación relacionada con una solicitud
const guardarNotificacionSOS = async (
  usuario,
  mensaje,
  telefonoUsuario,
  latitud,
  longitud,
  usuarioRemitente
) => {
  try {
    const notificacion = await guardarNotificacion(
      "sos",
      usuario,
      mensaje,
      null,
      telefonoUsuario,
      latitud,
      longitud,
      usuarioRemitente
    );

    return notificacion;
  } catch (error) {
    console.log(error);
    throw new Error("Error al guardar la notificación de solicitud");
  }
};

module.exports = {
  enviarNotificacion,
  guardarNotificacionPublicacion,
  guardarNotificacionSOS,
};
