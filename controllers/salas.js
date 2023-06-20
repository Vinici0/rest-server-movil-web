const { Mensaje, Sala } = require("../models");

const { generarCodigoUnico } = require("../helpers/generar-aleatorio");
const _ = require("lodash");

const obtenerMensajesSala = async (req, res) => {
  const { codigo } = req.params;

  try {
    const sala = await Sala.findOne({ codigo }).populate("mensajes");
    if (!sala) {
      return res.status(404).json({
        ok: false,
        msg: "Sala no encontrada",
      });
    }

    res.json({
      ok: true,
      mensajes: sala.mensajes,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const crearSala = async (req, res) => {
  const { nombre } = req.body;
  let codigo;
  let salaExistente;

  do {
    codigo = generarCodigoUnico();
    salaExistente = await Sala.findOne({ codigo });
  } while (salaExistente);

  const colorRandom = Array.from({ length: 3 }, () =>
    Math.floor(Math.random() * 256)
  ); // Generar tres valores aleatorios entre 0 y 255 para los componentes de color
  const color = colorRandom.reduce(
    (acc, curr) => acc + curr.toString(16).padStart(2, "0")
  ); // Convertir el color resultante a formato hexadecimal

  try {
    const sala = new Sala({ nombre, codigo, color, propietario: req.uid });

    const uid = req.uid;
    sala.usuarios.push(uid);
    await sala.save();

    //agrega el uid del usuario a la sala con el nombre de idUsuario
    const salaResponse = _.pick(sala.toObject(), ["nombre", "codigo", "color", "mensajes", "usuarios", "propietario", "_id"]);
    salaResponse.idUsuario = uid;

    res.json({
      ok: true,
      sala: salaResponse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};
const unirseSala = async (req, res) => {
  const { codigo } = req.body;
  const uid = req.uid;

  try {
    const sala = await Sala.findOne({ codigo });

    if (!sala) {
      return res.status(404).json({
        ok: false,
        msg: "Sala no encontrada",
      });
    }

    // Verificar si el usuario ya está en la sala
    if (sala.usuarios.includes(uid)) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario ya está en la sala",
      });
    }

    sala.usuarios.push(uid);
    await sala.save();

    const salaResponse = _.pick(sala.toObject(), [
      "nombre",
      "codigo",
      "color",
      "mensajes",
      "usuarios",
      "propietario",
      "_id",
    ]);
    salaResponse.idUsuario = uid;

    res.json({
      ok: true,
      sala: salaResponse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};



const grabarMensajeSala = async (req, res) => {
  try {
    const { mensaje, salaId } = req.body;
    const usuarioId = req.uid;

    const newMessage = new Mensaje({ mensaje, usuario: usuarioId });
    await newMessage.save();

    const sala = await Sala.findById(salaId);
    sala.mensajes.push(newMessage._id);
    await sala.save();

    res.json({
      ok: true,
      sala,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const getSalas = async (req, res) => {
  const uid = req.uid;
  const salas = await Sala.find(
    {},
    { nombre: 1, codigo: 1, _id: 1, usuarios: 1, color: 1 }
  );

 
  console.log(uid);
  res.json({
    ok: true,
    salas,
  });
};

const obtenerSalasMensajesUsuario = async (req, res) => {
  const uid = req.uid;

  try {
    const salas = await Sala.find({ usuarios: uid }).populate("mensajes");
    res.json({
      ok: true,
      salas,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const getSalesByUser = async (req, res) => {
  const uid = req.uid;
  try {
    const salas = await Sala.find(
      { usuarios: uid },
      { nombre: 1, _id: 1, color: 1, codigo: 1 }
    )

      
    const totalUsuarios = await Sala.find({ usuarios: uid }).countDocuments();
    res.json({
      ok: true,
      salas,
      totalUsuarios,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const getMensajesBySala = async (req, res) => {
  const { salaId } = req.params;
  try {
    const sala = await Sala.findById(salaId)
      .populate("mensajes")
      .populate("usuarios");

    res.json({
      ok: true,
      sala,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const getMensajesSala = async (req, res) => {
  try {
    const { salaId } = req.params;
    const sala = await Sala.findById(salaId).populate("mensajes");

    res.json({
      ok: true,
      sala,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const updateSala = async (req, res) => {
  try {
    const { salaId } = req.params;
    const { nombre, codigo, color } = req.body;

    const sala = await Sala.findByIdAndUpdate(
      salaId,
      { nombre, codigo, color },
      { new: true }
    );

    res.json({
      ok: true,
      sala,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const deleteSala = async (req, res) => {
  try {
    const { salaId } = req.params;
    const sala = await Sala.findByIdAndDelete(salaId);

    res.json({
      ok: true,
      sala,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const obtenerUsuariosSala = async (req, res) => {
  const { salaId } = req.params;
  try {
    const sala = await Sala.findById(salaId).populate("usuarios");

    if (!sala) {
      return res.status(404).json({
        ok: false,
        msg: "Sala no encontrada",
      });
    }

    res.json({
      ok: true,
      usuarios: sala.usuarios,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

module.exports = {
  crearSala,
  unirseSala,
  obtenerMensajesSala,
  grabarMensajeSala,
  getSalas,
  obtenerSalasMensajesUsuario,
  getSalesByUser,
  getMensajesBySala,
  getMensajesSala,
  updateSala,
  deleteSala,
  obtenerUsuariosSala,
};
