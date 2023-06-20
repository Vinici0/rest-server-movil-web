const axios = require("axios");

const enviarNotificacion = async (tokens, titulo, desc, priority = "high") => {
  if (tokens.length === 0) {
    return;
  }

  try {
    const response = await axios.post(
      "https://fcm.googleapis.com/fcm/send",
      {
        notification: {
          title: titulo,
          body: desc,
        },
        priority: priority,
        data: {
          product: "Agua Caliente",
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