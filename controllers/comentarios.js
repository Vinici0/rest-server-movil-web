const Comentario = require("../models/comentario");
const Publicacion = require("../models/publicacion");

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
    const comentarios = await Comentario.find({ publicacion: publicacionId });

    res.status(200).json({ comentarios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los comentarios" });
  }
};

const likeComentario = async (req, res) => {
    try {
        const comentarioId = req.params.id;
    
        // Verificar si el comentario existe
        const comentario = await Comentario.findById(comentarioId);
        if (!comentario) {
          return res.status(404).json({ error: "Comentario no encontrado" });
        }
    
        // Incrementar el contador de likes
        comentario.likes += 1;
        await comentario.save();
    
        res.status(200).json({ likes: comentario.likes });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al incrementar el contador de likes" });
      }
};

const dislikeComentario = async (req, res) => {
    try {
        const comentarioId = req.params.id;
    
        // Verificar si el comentario existe
        const comentario = await Comentario.findById(comentarioId);
        if (!comentario) {
          return res.status(404).json({ error: "Comentario no encontrado" });
        }
    
        // Verificar si el contador de likes es mayor a cero antes de decrementar
        if (comentario.likes > 0) {
          comentario.likes -= 1;
          await comentario.save();
        }
    
        res.status(200).json({ likes: comentario.likes });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al decrementar el contador de likes" });
      }
};

module.exports = {
  createComentario,
    getComentariosByPublicacion,
    likeComentario,
    dislikeComentario
};
