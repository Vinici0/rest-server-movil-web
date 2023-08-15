const {
  guardarNotificacionPublicacion,
  enviarNotificacion,
  guardarNotificacionPublicacionMensaje,
} = require("../helpers/enviar-notificacion");
const { Publicacion, Comentario, Usuario } = require("../models");

const createComentario2 = async (req, res) => {
  const usuarioId = req.uid;
  try {
    const { contenido, publicacionId } = req.body;

    // Verificar si la publicación existe
    const publicacion = await Publicacion.findById(publicacionId);
    if (!publicacion) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    // Crear el nuevo comentario
    const comentario = new Comentario({
      contenido,
      usuario: usuarioId,
      publicacion: publicacionId,
      estado: "publicado",
    });

    // Guardar el comentario en la base de datos
    await comentario.save();

    // Agregar el comentario a la lista de comentarios de la publicación
    publicacion.comentarios.push(comentario._id);
    await publicacion.save();
    res.status(201).json({ comentario });

    publicacion.toObject();
    publicacion.type = "publication";
    delete publicacion.__v;
    // Obtener los IDs de los usuarios que han comentado en la publicación
    const usuariosQueComentaron = await Usuario.find({
      _id: { $in: publicacion.comentarios },
    });

    console.log(usuariosQueComentaron);

    // Obtener los tokens de los usuarios para enviar notificaciones
    const tokens = usuariosQueComentaron.map((usuario) => usuario.tokenApp);
    console.log(tokens);
    const titulo =
      "Nuevo comentario en una publicación en la que has comentado";

    // Envío de notificaciones a los usuarios
    // await enviarNotificacion(tokens, titulo, contenido, publicacion);

    // Guardar notificaciones de comentarios en la publicación
    // for (const usuario of usuariosQueComentaron) {
    //   await guardarNotificacionPublicacion(
    //     usuario._id.toString(),
    //     contenido,
    //     publicacion._id.toString(),
    //     publicacion.latitud,
    //     publicacion.longitud,
    //     publicacion.usuario.toString()
    //   );
    // }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el comentario" });
  }
};

const createComentario = async (req, res) => {
  const usuarioId = req.uid;
  try {
    const { contenido, publicacionId } = req.body;

    // Verificar si la publicación existe
    const publicacion = await Publicacion.findById(publicacionId);
    if (!publicacion) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    // Crear el nuevo comentario
    const comentario = new Comentario({
      contenido,
      usuario: usuarioId,
      publicacion: publicacionId,
      estado: "publicado",
    });

    // Guardar el comentario en la base de datos
    await comentario.save();

    // Agregar el comentario a la lista de comentarios de la publicación
    publicacion.comentarios.push(comentario._id);
    await publicacion.save();
    res.status(201).json({ comentario });

    const publicacion2 = publicacion.toObject(); // Asignar la nueva instancia
    publicacion2.type = "publication";
    delete publicacion2.__v;
    console.log(publicacion2);
    
    // Obtener los comentarios relacionados con la publicación
    const comentariosDeLaPublicacion = await Comentario.find({ publicacion: publicacionId });

    // Obtener los IDs de los usuarios que han comentado
    const usuariosQueComentaronIds = comentariosDeLaPublicacion.map((comentario) => comentario.usuario);

    // Obtener los usuarios que han comentado
    const usuariosQueComentaron = await Usuario.find({ _id: { $in: usuariosQueComentaronIds } });

    // Obtener los tokens de los usuarios para enviar notificaciones
    const tokens = usuariosQueComentaron.map((usuario) => usuario.tokenApp);
    const titulo = "Comentaron en un reporte";
    const subTitulo = "Comentario en un reporte en el que has comentado";
    // Envío de notificaciones a los usuarios
    await enviarNotificacion(tokens, titulo, contenido, publicacion2);

    // Guardar notificaciones de comentarios en la publicación
    for (const usuario of usuariosQueComentaron) {
      await guardarNotificacionPublicacionMensaje(
        usuario._id.toString(),
        contenido,
        publicacion2._id.toString(),
        publicacion2.latitud,
        publicacion2.longitud,
        publicacion2.usuario.toString()
      );
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el comentario" });
  }
};


const getComentariosByPublicacion = async (req, res) => {
  try {
    const { publicacionId } = req.params;
    // Buscar los comentarios de la publicación en la base de datos
    const comentarios = await Comentario.find({
      publicacion: publicacionId,
    }).populate("usuario", "nombre google img");

    res.status(200).json({
      ok: true,
      comentarios,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los comentarios" });
  }
};

const toggleLikeComentario = async (req, res) => {
  try {
    const comentarioId = req.params.id;

    const comentario = await Comentario.findById(comentarioId).populate(
      "usuario",
      "nombre img"
    );
    if (!comentario) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    // Verificar si el usuario ya ha dado like al comentario
    const usuarioId = req.uid;
    const usuarioIndex = comentario.likes.findIndex(
      (userId) => userId.toString() === usuarioId
    );

    if (usuarioIndex === -1) {
      // El usuario no ha dado like al comentario, agregar el like
      comentario.likes.push(usuarioId);
    } else {
      // El usuario ya ha dado like al comentario, quitar el like
      comentario.likes.splice(usuarioIndex, 1);
    }

    await comentario.save();

    res.status(200).json({ ok: true, comentario: comentario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al modificar el contador de likes" });
  }
};

module.exports = {
  createComentario,
  getComentariosByPublicacion,
  toggleLikeComentario,
};
