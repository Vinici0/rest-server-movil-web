const express = require("express");
const path = require("path");
const cors = require("cors");
const fileUpload = require('express-fileupload');
require("dotenv").config();

// DB Config
require("./database/config").dbConnection();

// App de Express
const app = express();
app.use(cors());

// Lectura y parseo del Body
app.use(express.json());

// Node Server
const server = require("http").createServer(app);
module.exports.io = require("socket.io")(server);
require("./sockets/socket");
const publicPath = path.resolve(__dirname, "./prueba/public");
app.use(express.static(publicPath));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: true
  })
);

// Mis Rutas
app.use("/api/buscar", require("./routes/buscar"));
app.use("/api/comentarios", require("./routes/comentarios"));
app.use("/api/login", require("./routes/auth"));
app.use("/api/mensajes", require("./routes/mensajes"));
app.use("/api/publicacion", require("./routes/publicaciones"));
app.use("/api/salas", require("./routes/salas"));
app.use("/api/ubicaciones", require("./routes/ubicaciones"));
app.use("/api/uploads", require("./routes/uploads"));
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/reportes", require("./routes/reportes"));


server.listen(process.env.PORT, (err) => {
  if (err) throw new Error(err);
  console.log("Servidor corriendo en puerto", process.env.PORT);
});

