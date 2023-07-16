const { Publicacion, Comentario } = require("../models");

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

    console.log(comentario);

    // Guardar el comentario en la base de datos
    await comentario.save();

    // Agregar el comentario a la lista de comentarios de la publicación
    publicacion.comentarios.push(comentario._id);
    await publicacion.save();

    res.status(201).json({ comentario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el comentario" });
  }
};

const getComentariosByPublicacion = async (req, res) => {
  try {
    const { publicacionId } = req.params;
    // Buscar los comentarios de la publicación en la base de datos
    const comentarios = await Comentario.find({ publicacion: publicacionId })
      .populate("usuario", "nombre img google")


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
    console.log(comentarioId, "comentarioId");

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
