const axios = require("axios");

const enviarNotificacion = async (tokens, titulo, desc, usuario = {}) => {
  if (tokens.length === 0) {
    console.log("No hay tokens");
    return;
  }

  const data = {
    nombre: usuario.nombre,
    latitud: usuario.latitud,
    longitud: usuario.longitud
  };


  try {
    const response = await axios.post(
      "https://fcm.googleapis.com/fcm/send",
      {
        notification: {
          title: titulo,
          body: desc,
        },
        priority:"high",
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

module.exports = {
    enviarNotificacion,
};