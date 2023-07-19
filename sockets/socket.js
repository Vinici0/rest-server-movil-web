const { comprobarJWT } = require("../helpers/jwt");
const { io } = require("../index");
const {
  usuarioConectado,
  usuarioDesconectado,
  grabarMensajeSala,
  grabarComentarioPublicacion,
} = require("../controllers/socket");

// Mensajes de Sockets
io.on("connection", (client) => {
  console.log("Cliente conectado");

  // console.log(client.handshake.headers);
  console.log(client.handshake.headers["x-token"], "token");

  const [valido, uid] = comprobarJWT(client.handshake.headers["x-token"]);

  // Verificar autenticación

  if (!valido) {
    console.log("Cliente no autenticado");
    return client.disconnect();
  }

  // Cliente autenticado
  usuarioConectado(uid);
  console.log("Cliente autenticado");
  client.on("join-room", async (payload) => {
    const { codigo } = payload;
    console.log(codigo, "codigo");

    const [valido, uid] = comprobarJWT(client.handshake.headers["x-token"]);

    if (!valido) {
      console.log("Token inválido");
      client.disconnect();
    } else {
      client.join(codigo);
    }
  });

  client.on("mensaje-grupal", async (payload) => {
    grabarMensajeSala(payload);
    client.broadcast.to(payload.para).emit("mensaje-grupal", payload);
  });

  client.on("comentario-publicacion", async (payload) => {
    grabarComentarioPublicacion(payload);
    client.broadcast.to(payload.para).emit("comentario-publicacion", payload);
  });
  

  client.on("disconnect", () => {
    usuarioDesconectado(uid);
    console.log("Cliente desconectado");
  });
});
