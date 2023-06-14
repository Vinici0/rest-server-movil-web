const { response } = require("express");
const {Usuario} = require("../models");

const getUsuarios = async (req, res = response) => {
  const desde = Number(req.query.desde) || 0;

  const usuarios = await Usuario.find({ _id: { $ne: req.uid } })
    .sort("-online")
    .skip(desde)
    .limit(20);

  res.json({
    ok: true,
    usuarios,
  });
};

const actualizarUsuario = async (req, res) => {
  const uid = req.uid;
  console.log(uid, "uid");
  const { nombre, email, online, password, ...resto } = req.body; 

  console.log(resto, "resto");

  try {
    // Busca y actualiza el usuario por su ID
    const usuario = await Usuario.findByIdAndUpdate(uid, resto, { new: true });

    res.json({
      ok: true,
      usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

// Controlador para agregar una nueva dirección a un usuario
const agregarDireccion = async (req, res) => {
  const idUsuario = req.uid;
  const { latitud, longitud } = req.body;

  try {
    const usuario = await Usuario.findById(idUsuario);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const nuevaDireccion = {
      latitud,
      longitud,
    };

    usuario.direcciones.push(nuevaDireccion);

    await usuario.save();

    res.status(201).json({ mensaje: "Dirección agregada", usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al agregar la dirección" });
  }
};

module.exports = {
  getUsuarios,
  actualizarUsuario,
  agregarDireccion,
};
