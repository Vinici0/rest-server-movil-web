const { calcularDistancia } = require("../helpers/calcular-distancia");
const {
  enviarNotificacion,
  guardarNotificacionPublicacion,
} = require("../helpers/enviar-notificacion");
const { subirArchivoPublicacion } = require("../helpers/subir-archivo");
const { Usuario, Publicacion } = require("../models");

const obtenerPublicacionesUsuario = async (req, res) => {
  const usuarioId = req.uid;
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
    nombreUsuario,
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
      nombreUsuario,
    });
    await publicacion.save();

    res.json({
      ok: true,
      publicacion,
    });

    const usuarios = await Usuario.find().populate(
      "ubicaciones",
      "latitud longitud tokenApp"
    );

    const usuariosEnRadio = usuarios.filter((usuario) => {
      return usuario.ubicaciones.some((ubicacion) => {
        const distancia = calcularDistancia(
          ubicacion.latitud,
          ubicacion.longitud,
          latitud,
          longitud
        );
        return distancia <= radio;
      });
    });

    const tokens = usuariosEnRadio
      .filter((usuario) => usuario._id.toString() !== usuarioId.toString())
      .map((usuario) => usuario.tokenApp);

    // Actualizar el campo isPublicacionPendiente a true para todos los usuarios en usuariosEnRadio
    for (const usuario of usuariosEnRadio) {
      usuario.isPublicacionPendiente = true;
      usuario.isNotificacionesPendiente = true;
      await usuario.save();
    }

    //TODO: Notificar a los usuarios en el radio
    const publicacion2 = publicacion.toObject();
    publicacion2.type = "publication";
    console.log(publicacion2);
    delete publicacion2.__v;
    await enviarNotificacion(tokens, titulo, contenido, publicacion2);

     const usuariosEnRadio2 = usuariosEnRadio.filter((usuario) => usuario._id.toString() !== usuarioId.toString()); 

    for (const usuario of usuariosEnRadio2) {
      await guardarNotificacionPublicacion(
        usuario._id,
        contenido,
        publicacion._id,
        latitud,
        longitud,
        usuarioId  
      );
    }
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

  const archivo = req.files?.archivo;

  try {
    const publicacion = await Publicacion.findById(uid);

    if (!publicacion) {
      return res.status(404).json({ mensaje: "Publicación no encontrada" });
    }
    if (archivo !== undefined && archivo !== null) {
      if (Array.isArray(archivo)) {
        for (const file of archivo) {
          const nombre = await subirArchivoPublicacion(
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
        const nombre = await subirArchivoPublicacion(
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
  const { limite = 15, desde = 0 } = req.query;
  try {
    const usuario = await Usuario.findById(req.uid).populate(
      "ubicaciones",
      "latitud longitud"
    );

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    let publicacionesEnRadio;

    if (usuario.ubicaciones.length > 0) {
      publicacionesEnRadio = await Publicacion.find({
        latitud: { $exists: true },
        longitud: { $exists: true },
        isActivo: true,
      })
        .sort({ createdAt: -1 })
        .skip(Number(desde));

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
      publicacionesEnRadio = await Publicacion.find({ isActivo: true })
        .sort({ createdAt: -1 })
        .skip(Number(desde));
    }

    publicacionesEnRadio = publicacionesEnRadio.slice(0, Number(limite));

    res.json({
      ok: true,
      publicaciones: publicacionesEnRadio,
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

//isPublicacionPendiente a true
const isPublicacionFinalizada = async (req, res) => {
  const usuarioId = req.uid;

  try {
    const { publicacionId } = req.params;

    // Verificar si la publicación existe
    const publicacion = await Publicacion.findById(publicacionId);
    if (!publicacion) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    // Verificar si el usuario es el dueño de la publicación
    if (publicacion.usuario.toString() !== usuarioId) {
      return res.status(401).json({ error: "No autorizado para modificar esta publicación" });
    }

    // Cambiar el estado de isPublicacionPendiente a true
    publicacion.isPublicacionPendiente = true;
    await publicacion.save();

    res.status(200).json({ message: "La publicación se ha finalizado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al marcar la publicación como pendiente" });
  }
};

//delete publicacion
const deletePublicacion = async (req, res) => {
  const { id } = req.params;
  try {
    await Publicacion.findByIdAndDelete(id);
    // await Publicacion.findByIdAndUpdate(id, { isActivo: false });
    res.status(200).json({ message: "Publicación eliminada con éxito" });
  } catch (error) { 
    res.status(500).json({ message: "Error al eliminar la publicación" });
  }
};

const actualizarDescripcion = async (req, res) => {
  const { id } = req.params;
  const { descripcion } = req.body;

  try {
    if (!descripcion) {
      return res.status(400).json({ mensaje: "La descripción es obligatoria" });
    }

    //actualizar
      await Publicacion.findByIdAndUpdate(id, { contenido: descripcion });  

    res.json({
      ok: true,
      mensaje: "Descripción actualizada con éxito",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      mensaje: "Error inesperado",
    });
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
  isPublicacionFinalizada,
  deletePublicacion,
  actualizarDescripcion
};
