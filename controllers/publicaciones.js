const { calcularDistancia } = require("../helpers/calcular-distancia");
const { enviarNotificacion } = require("../helpers/enviar-notificacion");
const { subirArchivo } = require("../helpers/subir-archivo");
const { Usuario, Publicacion } = require("../models");

const obtenerPublicacionesUsuario = async (req, res) => {
  const usuarioId = req.uid; // ID del usuario obtenido del token de autenticación

  try {
    const publicaciones = await Publicacion.find({ usuario: usuarioId });

    res.json({
      ok: true,
      publicaciones,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const guardarPublicacion = async (req, res) => {
  const radio = 2;
  const usuarioId = req.uid;
  const nombres = [];
  const {
    titulo,
    contenido,
    color,
    ciudad,
    barrio,
    isPublic,
    imagenes,
    imgAlerta,
    latitud,
    longitud,
  } = req.body;

  try {
    const publicacion = new Publicacion({
      titulo,
      contenido,
      color,
      ciudad,
      barrio,
      isPublic,
      usuario: usuarioId,
      imagenes,
      imgAlerta,
      latitud,
      longitud,
    });

    await publicacion.save();

    res.json({
      ok: true,
      publicacion,
    });

    const usuarios = await Usuario.find();

    const usuariosEnRadio = usuarios.filter((usuario) => {
      return usuario.ubicaciones.some((direccion) => {
        const distancia = calcularDistancia(
          direccion.latitud,
          direccion.longitud,
          latitud,
          longitud
        );
        return distancia <= radio;
      });
    });

    const tokens = usuariosEnRadio
      .filter((usuario) => usuario._id.toString() !== usuarioId.toString())
      .map((usuario) => usuario.tokenApp);

    await enviarNotificacion(tokens, titulo, contenido);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const guardarListArchivo = async (req, res) => {
  const nombres = [];
  const { titulo, uid } = req.params;

  console.log(titulo, uid);
  const archivo = req.files?.archivo;

  try {
    const publicacion = await Publicacion.findById(uid);

    if (!publicacion) {
      return res.status(404).json({ mensaje: "Publicación no encontrada" });
    }
    if (archivo !== undefined && archivo !== null) {
      if (Array.isArray(archivo)) {
        for (const file of archivo) {
          const nombre = await subirArchivo(
            file,
            undefined,
            "publicaciones/" + titulo.replace(/\s/g, "")
          );
          if (!publicacion.imagenes) {
            publicacion.imagenes = []; // Inicializar como un array vacío si es nulo
          }
          publicacion.imagenes.push(nombre);
          nombres.push(nombre);
        }
      } else {
        const nombre = await subirArchivo(
          archivo,
          undefined,
          "publicaciones/" + titulo.replace(/\s/g, "")
        );
        if (!publicacion.imagenes) {
          publicacion.imagenes = []; // Inicializar como un array vacío si es nulo
        }
        publicacion.imagenes.push(nombre);
        nombres.push(nombre);
      }
    }

    await publicacion.save();

    res.json({
      ok: true,
      publicacion,
      nombres,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const getPublicacionesEnRadio = async (req, res) => {
  const radio = 2; // Radio en kilómetros
  const { limite = 12, desde = 0 } = req.query;
  try {
    const usuario = await Usuario.findById(req.uid).populate(
      "ubicaciones",
      "latitud longitud"
    );
    console.log(usuario.ubicaciones);
    for (let i = 0; i < usuario.ubicaciones.length; i++) {
      console.log(usuario.ubicaciones[i].latitud);
      console.log(usuario.ubicaciones[i].longitud);
    }

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    let publicacionesEnRadio;

    if (usuario.ubicaciones.length > 0) {
      // Si el usuario tiene latitud y longitud en al menos una dirección, filtrar las publicaciones dentro del radio
      publicacionesEnRadio = await Publicacion.find({
        latitud: { $exists: true },
        longitud: { $exists: true },
      })
        .sort({ createdAt: -1 })
        .skip(Number(desde))
        .limit(Number(limite));

      publicacionesEnRadio = publicacionesEnRadio.filter((publicacion) => {
        return usuario.ubicaciones.some((direccion) => {
          const distancia = calcularDistancia(
            publicacion.latitud,
            publicacion.longitud,
            direccion.latitud,
            direccion.longitud
          );

          return distancia <= radio;
        });
      });
    } else {
      // Si el usuario no tiene latitud y longitud en ninguna dirección, obtener todas las publicaciones
      //ordenadas por fecha de creación
      publicacionesEnRadio = await Publicacion.find().exec();
    }

    //agrega el nombre del usuario a cada publicacion
    let publicacionesEnRadio2 = publicacionesEnRadio.map((publicacion) => {
      return {
        ...publicacion._doc,
        usuarioNombre: usuario.nombre,
        uid: publicacion._id,
      };
    });

    res.json({
      ok: true,
      publicaciones: publicacionesEnRadio2,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener las publicaciones." });
  }
};

const dislikePublicacion = async (req, res) => {
  try {
    const publicacionId = req.params.id;

    // Verificar si la publicación existe
    const publicacion = await Publicacion.findById(publicacionId);
    if (!publicacion) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    // Verificar si el contador de likes es mayor a cero antes de decrementar
    if (publicacion.likes > 0) {
      publicacion.likes -= 1;
      await publicacion.save();
    }

    res.status(200).json({ likes: publicacion.likes });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al decrementar el contador de likes" });
  }
};

//update publicacion
const updatePublicacion = async (req, res) => {
  const { id } = req.params;
  const { isLiked, likes } = req.body;

  try {
    const publicacion = await Publicacion.findById(id);

    if (!publicacion) {
      return res.status(404).json({ mensaje: "Publicacion no encontrada" });
    }

    const nuevaPublicacion = {
      isLiked,
      likes,
      usuario: req.uid,
    };

    const publicacionActualizada = await Publicacion.findByIdAndUpdate(
      id,
      nuevaPublicacion,
      { new: true }
    );

    res.json({
      ok: true,
      publicacion: publicacionActualizada,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      mensaje: "Error inesperado",
    });
  }
};

const updatePublicacion2 = async (req, res) => {
  const { id } = req.params;
  const { likes } = req.body;

  try {
    const publicacion = await Publicacion.findById(id);

    if (!publicacion) {
      return res.status(404).json({ mensaje: "Publicacion no encontrada" });
    }

    const nuevaPublicacion = {
      likes,
      usuario: req.uid,
    };

    const publicacionActualizada = await Publicacion.findByIdAndUpdate(
      id,
      nuevaPublicacion,
      { new: true }
    );

    res.json({
      ok: true,
      publicacion: publicacionActualizada,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      mensaje: "Error inesperado",
    });
  }
};

const obtenerPublicacionesUsuarioConLikes = async (req, res) => {
  const usuarioId = req.uid; // ID del usuario obtenido del token de autenticación

  try {
    const publicaciones = await Publicacion.find({ usuario: usuarioId });

    const publicacionesConLikes = publicaciones.filter(
      (publicacion) => publicacion.isLiked
    );

    res.json({
      ok: true,
      publicacionesConLikes,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

//update like publicacion
const likePublicacion = async (req, res) => {
  try {
    const publicacionId = req.params.id;
    const usuarioId = req.uid;

    // Verificar si la publicación existe
    const publicacion = await Publicacion.findById(publicacionId);
    if (!publicacion) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    // Verificar si el usuario ya ha dado like a la publicación
    const usuarioYaDioLike = publicacion.likes.includes(usuarioId.toString());

    if (!usuarioYaDioLike) {
      // Agregar el ID del usuario a la lista de likes
      publicacion.likes.push(usuarioId);
    } else {
      // Eliminar el ID del usuario de la lista de likes
      publicacion.likes = publicacion.likes.filter(
        (id) => id.toString() !== usuarioId.toString()
      );
    }

    await publicacion.save();

    res.status(200).json({ publicacion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al gestionar el like" });
  }
};

module.exports = {
  obtenerPublicacionesUsuario,
  guardarPublicacion,
  getPublicacionesEnRadio,
  likePublicacion,
  dislikePublicacion,
  updatePublicacion,
  updatePublicacion2,
  obtenerPublicacionesUsuarioConLikes,
  guardarListArchivo,
};
