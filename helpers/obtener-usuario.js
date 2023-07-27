

const Sala = require("../models/");

const obtenerUsuariosSalaHelper = async (salaId) => {
    try {
      const usuariosEnSala = await Sala.findById(salaId).populate({
        path: "usuarios",
        match: { online: false },
      });
      return usuariosEnSala.usuarios;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

    module.exports = {
        obtenerUsuariosSalaHelper
    }