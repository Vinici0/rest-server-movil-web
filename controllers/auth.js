const { response } = require("express");
const bcrypt = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");
const { validarGoogleIdToken } = require("../helpers/google-verify-token");

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

  try {
    const usuarioDB = await Usuario.findOne({ email }).populate(
      "ubicaciones",
      "latitud longitud ciudad pais barrio"
    ).exec();
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
      await Usuario.findOneAndUpdate({ email }, { tokenApp });//b
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

const googleAuth = async (req, res = response) => {
  const token = req.body.token;
  const { tokenApp } = req.body;
  if (!token) {
    return res.json({
      ok: false,
      msg: "No hay token en la petición",
    });
  }

  const googleUser = await validarGoogleIdToken(token);
  const { email } = googleUser;
  try {
    if (!googleUser) {
      return res.status(400).json({
        ok: false,
      });
    }

    let usuarioDB = await Usuario.findOne({ email }).populate(
      "ubicaciones",
      "latitud longitud ciudad pais barrio"
    );

    if (!usuarioDB) {
      // Si el usuario no existe, lo creamos
      const data = {
        nombre: googleUser.name,
        tokenApp: tokenApp,
        email: googleUser.email,
        password: "@@@",
        img: googleUser.picture,
        google: true,
      };

      usuarioDB = new Usuario(data);

      await usuarioDB.save();
    }
    // Generar el JWT
    const token = await generarJWT(usuarioDB.id);

    return res.json({
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
  try {
    const uid = req.uid;

    // generar un nuevo JWT, generarJWT... uid...
    const token = await generarJWT(uid);

    // Obtener el usuario por el UID, Usuario.findById...
    const usuario = await Usuario.findById(uid).populate(
      "ubicaciones",
      "latitud longitud ciudad pais barrio"
    );

    usuario.ubicaciones.uid = usuario.ubicaciones._id;

    res.json({
      ok: true,
      usuario,
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


module.exports = {
  crearUsuario,
  login,
  renewToken,
  googleAuth,
};
