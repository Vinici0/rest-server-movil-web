const { response } = require("express");
const { Usuario } = require("../models");
const { enviarNotificacion } = require("../helpers/enviar-notificacion");

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
  const { nombre, email, online, password, telefono, ...resto } = req.body;

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

const actualizarTelefonoOrNombre = async (req, res) => {
  const uid = req.uid;
  const { nombre, telefono } = req.body;
  console.log(nombre, telefono);

  try {
    // Busca y actualiza el usuario por su ID
    const usuario = await Usuario.findByIdAndUpdate(
      uid,
      { nombre, telefono },
      { new: true }
    );

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


const ageregarTelefonos = async (req, res) => {
  const idUsuario = req.uid;

  const { telefono } = req.body;

  try {
    const usuario = await Usuario.findById(idUsuario);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Verificar si el teléfono ya está asociado al usuario
    if (usuario.telefonos.includes(telefono)) {
      return res.status(400).json({
        ok: false,
        msg: "El teléfono ya está asociado al usuario",
      });
    }

    usuario.telefonos.push(telefono);
    await usuario.save();

    res.status(201).json({ mensaje: "Teléfono agregado", usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al agregar el teléfono" });
  }
};

const eliminarTelefono = async (req, res) => {
  const idUsuario = req.uid;
  const { telefono } = req.body;

  try {
    const usuario = await Usuario.findById(idUsuario);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Verificar si el teléfono está asociado al usuario
    if (!usuario.telefonos.includes(telefono)) {
      return res.status(400).json({
        ok: false,
        msg: "El teléfono no está asociado al usuario",
      });
    }

    // Eliminar el teléfono del arreglo
    usuario.telefonos = usuario.telefonos.filter((tel) => tel !== telefono);
    await usuario.save();

    res.status(200).json({ mensaje: "Teléfono eliminado", usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar el teléfono" });
  }
};


const agregarTelefono = async (req, res) => {
  const idUsuario = req.uid;
  const { telefono } = req.body;

  try {
    const usuario = await Usuario.findById(idUsuario);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    usuario.telefono = telefono;
    await usuario.save();

    res.status(201).json({ mensaje: "Teléfono agregado", usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al agregar el teléfono" });
  }
};

const enviarNotificacionesArrayTelefonos = async (req, res) => {
  const idUsuario = req.uid;
  const { lat, lng } = req.body;

  try {
    const usuario = await Usuario.findById(idUsuario).populate("ubicaciones", "latitud longitud");

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    const data = {
      nombre: usuario.nombre,
      latitud: lat,
      longitud: lng,
    };

    const telefonos = usuario.telefonos; // Obtener el arreglo de teléfonos del usuario

    const usuariosConTelefono = await Usuario.find({ telefono: { $in: telefonos } });
    const tokens = usuariosConTelefono.map((usuario) => usuario.tokenApp);

    const titulo = `${usuario.nombre} necesita ayuda`;
    const contenido = "Presiona para ver la ubicación";
    await enviarNotificacion(tokens, titulo, contenido, data);

    res.status(200).json({ mensaje: "Notificación enviada", usuarios: usuariosConTelefono });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al enviar la notificación" });
  }
};






module.exports = {
  getUsuarios,
  actualizarUsuario,
  agregarDireccion,
  ageregarTelefonos,
  agregarTelefono,
  eliminarTelefono,
  enviarNotificacionesArrayTelefonos,
  actualizarTelefonoOrNombre
};
