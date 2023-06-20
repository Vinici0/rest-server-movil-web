const { response } = require("express");
const bcrypt = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { email, password, tokenApp } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya está registrado",
      });
    }

    const usuario = new Usuario(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    usuario.tokenApp = tokenApp;
    await usuario.save();

    // Generar mi JWT
    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};
const login = async (req, res = response) => {
  const { email, password, tokenApp } = req.body;

  console.log(email, password);
  try {
    const usuarioDB = await Usuario.findOne({ email }).populate(
      "ubicaciones",
      "latitud longitud ciudad pais barrio"
    );
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Email no encontrado",
      });
    }

    // Validar el password
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "La contraseña no es valida",
      });
    }

    // Actualizar el token de dispositivo si se proporciona
    if (tokenApp) {
      await Usuario.findOneAndUpdate({ email }, { tokenApp });
    }

    // Generar el JWT
    const token = await generarJWT(usuarioDB.id);

    res.json({
      ok: true,
      usuario: usuarioDB,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const renewToken = async (req, res = response) => {
  const uid = req.uid;

  // generar un nuevo JWT, generarJWT... uid...
  const token = await generarJWT(uid);

  // Obtener el usuario por el UID, Usuario.findById...
  const usuario = await Usuario.findById(uid).populate(
    "ubicaciones",
    "latitud longitud ciudad pais barrio"
  );

  usuario.ubicaciones.uid =  usuario.ubicaciones._id;

  res.json({
    ok: true,
    usuario,
    token,
  });
};

module.exports = {
  crearUsuario,
  login,
  renewToken,
};
