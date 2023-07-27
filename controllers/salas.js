const { Mensaje, Sala, Usuario } = require("../models");

const { generarCodigoUnico } = require("../helpers/generar-aleatorio");
const _ = require("lodash");
// const { obtenerUsuariosSalaHelper } = require("../helpers/obtener-usuario");

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
    const salaResponse = _.pick(sala.toObject(), [
      "nombre",
      "codigo",
      "color",
      "mensajes",
      "usuarios",
      "propietario",
      "_id",
    ]);
    //total de usuarios en la sala
    salaResponse.totalUsuarios = sala.usuarios.length;
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

    // Agregar al usuario a la lista de usuarios de la sala
    sala.usuarios.push(uid);
    await sala.save();

    // Agregar la sala a la lista de salas del usuario
    const usuario = await Usuario.findById(uid);
    usuario.salas.push({
      salaId: sala._id,
      mensajesNoLeidos: 0, // Inicializar a cero mensajes no leídos al unirse a la sala
      ultimaVezActivo: null, // Inicializar como null ya que aún no ha enviado mensajes en esta sala
    });
    await usuario.save();

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
    salaResponse.totalUsuarios = sala.usuarios.length;
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

    const usuariosEnGrupoOffline = await obtenerUsuariosSalaHelper(salaId);

    // Actualizar la cantidad de mensajes no leídos solo para los usuarios offline en el grupo
    for (const usuario of usuariosEnGrupoOffline) {
      usuario.salas = usuario.salas.map((sala) => {
        if (sala.salaId.toString() === salaId) {
          sala.mensajesNoLeidos++;
          sala.ultimaVezActivo = new Date();
        }

        return sala;
      });
    }

    await Promise.all(usuariosEnGrupoOffline.map((usuario) => usuario.save()));

    res.json({
      ok: true,
      sala: sala,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

/* 
  obtenerUsuariosSalaHelper
  Esta función obtiene los usuarios de una sala que están offline y que no han abierto la sala en la aplicación.
*/
const obtenerUsuariosSalaHelper = async (salaId) => {
  try {
    const usuariosEnSala = await Usuario.find({
      'salas.salaId': salaId,
      'salas.isRoomOpen': false,
    });
    return usuariosEnSala;
  } catch (error) {
    console.log(error);
    return [];
  }
};


const cambiarEstadoSala = async (req, res) => {
  try {
    const { isRoomOpen } = req.body;
    const userId = req.uid;

    // Encuentra el usuario por su ID
    const usuario = await Usuario.findById(userId);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }
    console.log(usuario);

    // Find the sala with the given salaId in the salas array
    const salaToUpdate = usuario.salas.find(
      (sala) => sala.salaId.toString() === req.params.salaId
    );

    if (!salaToUpdate) {
      return res.status(404).json({
        ok: false,
        msg: "Sala no encontrada para el usuario",
      });
    }

    // Update the isRoomOpen property for the found sala
    salaToUpdate.isRoomOpen = isRoomOpen;

    await usuario.save();

    return res.json({
      ok: true,
      msg: "Estado de la sala actualizado exitosamente",
      usuario: usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administradorrr",
    });
  }
};



const obtenerSalasConMensajesNoLeidos = async (req, res) => {
  const usuarioId = req.uid;

  try {
    const usuario = await Usuario.findById(usuarioId);
    const salas = usuario.salas;
    const salasConMensajesNoLeidos = [];
    for (const sala of salas) {
      // Obtener la información de la sala
      const salaInfo = await Sala.findById(sala.salaId);
      // Obtener el total de usuarios en la sala
      const totalUsuariosSala = salaInfo.usuarios.length;
      // Si la sala tiene mensajes no leídos, se agrega al array con la cantidad de mensajes no leídos y el total de usuarios
      if (sala.mensajesNoLeidos > 0) {
        salasConMensajesNoLeidos.push({
          uid: salaInfo._id,
          nombre: salaInfo.nombre,
          color: salaInfo.color,
          propietario: salaInfo.propietario,
          codigo: salaInfo.codigo,
          mensajesNoLeidos: sala.mensajesNoLeidos,
          totalUsuarios: totalUsuariosSala,
        });
      } else {
        // Si la sala no tiene mensajes no leídos, se agrega al array con 0 mensajes no leídos y el total de usuarios
        salasConMensajesNoLeidos.push({
          uid: salaInfo._id,
          nombre: salaInfo.nombre,
          color: salaInfo.color,
          codigo: salaInfo.codigo,
          propietario: salaInfo.propietario,
          mensajesNoLeidos: 0,
          totalUsuarios: totalUsuariosSala,
        });
      }
    }

    res.json({
      ok: true,
      salas: salasConMensajesNoLeidos,
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
    { nombre: 1, codigo: 1, _id: 1, usuarios: 1, color: 1, propietario: 1 }
  );

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

const getSalasByUser = async (req, res) => {
  const uid = req.uid;
  try {
    const salas = await Sala.find(
      { usuarios: uid, isActivo: true },
      { nombre: 1, _id: 1, color: 1, codigo: 1, propietario: 1 }
    );

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
    const sala = await Sala.findByIdAndUpdate(
      salaId,
      { isActivo: false },
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

const obtenerUsuariosSala = async (req, res) => {
  const { salaId } = req.params;
  try {
    const sala = await Sala.findById(salaId).populate({
      path: "usuarios",
      populate: {
        path: "ubicaciones",
        model: "Ubicacion", // Reemplaza "Ubicacion" con el nombre de tu modelo de ubicaciones
      },  
    });

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

const deleteUserById = async (req, res) => {
  const { salaId, usuarioId } = req.params;
  const uid = req.uid;
  try {
    const sala = await Sala.findById(salaId);

    if (!sala) {
      return res.status(404).json({
        ok: false,
        msg: "Sala no encontrada",
      });
    }

    // Verificar si el usuario es el propietario de la sala
    if (sala.propietario.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No estás autorizado para realizar esta acción",
      });
    }

    // Verificar si el usuario a eliminar existe en la sala
    if (!sala.usuarios.includes(usuarioId)) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado en la sala",
      });
    }

    // Eliminar al usuario de la sala
    sala.usuarios.pull(usuarioId);
    await sala.save();

    res.json({
      ok: true,
      msg: "Usuario eliminado exitosamente de la sala",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const abandonarSala = async (req, res) => {
  const { salaId } = req.params;
  const uid = req.uid;

  try {
    const sala = await Sala.findById(salaId);

    if (!sala) {
      return res.status(404).json({
        ok: false,
        msg: "Sala no encontrada",
      });
    }

    // Verificar si el usuario está en la sala
    if (!sala.usuarios.includes(uid)) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no está en la sala",
      });
    }

    // Quitar al usuario de la sala
    sala.usuarios.pull(uid);
    await sala.save();

    res.json({
      ok: true,
      msg: "Usuario abandonó la sala exitosamente",
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
  abandonarSala,
  crearSala,
  deleteSala,
  deleteUserById,
  getMensajesBySala,
  getMensajesSala,
  getSalas,
  getSalasByUser,
  grabarMensajeSala,
  obtenerMensajesSala,
  obtenerSalasMensajesUsuario,
  obtenerUsuariosSala,
  unirseSala,
  updateSala,
  obtenerSalasConMensajesNoLeidos,
  cambiarEstadoSala
};
