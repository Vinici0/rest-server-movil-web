const { comprobarJWT } = require("../helpers/jwt");
const { io } = require("../index");
const {
  usuarioConectado,
  usuarioDesconectado,
  grabarMensajeSala,
} = require("../controllers/socket");

// Mensajes de Sockets
io.on("connection", (client) => {
  console.log("Cliente conectado");

  // console.log(client.handshake.headers);
  console.log(client.handshake.headers["x-token"], "token");
  console.log("cliente.id");
  const [valido, uid] = comprobarJWT(client.handshake.headers["x-token"]);

   // Verificar autenticación
   
   if (!valido) {
    console.log("Cliente no autenticado");
    return client.disconnect();
   }

  // Cliente autenticado
  usuarioConectado(uid);
  console.log("Cliente autenticado");
  // TODO: Ingresar al usuario a una sala en particular
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

  //mensaje-grupal
  client.on("mensaje-grupal", async (payload) => {
    grabarMensajeSala(payload);
    client.broadcast.to(payload.para).emit("mensaje-grupal", payload);
  });

  client.on("disconnect", () => {
    usuarioDesconectado(uid);
    console.log("Cliente desconectado");
  });
});
