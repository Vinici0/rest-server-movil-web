const express = require("express");
const path = require("path");
const cors = require("cors");
const fileUpload = require('express-fileupload');
require("dotenv").config();

require("./database/config").dbConnection();

const app = express();
app.use(cors());

app.use(express.json());

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
app.use("/api/notificacion", require("./routes/notificaciones"));
app.use("/api/denuncias", require("./routes/denuncias"));
app.use("/api/documents", require("./routes/documents"));

module.exports = {
  app,
  server,
}