
const { app,server } = require("./app");

server.listen(process.env.PORT, (err) => {
  if (err) throw new Error(err);
  console.log("Servidor corriendo en puerto", process.env.PORT);
});

