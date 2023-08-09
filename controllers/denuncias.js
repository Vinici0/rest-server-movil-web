const { Usuario, Publicacion, Denuncia } = require("../models");

const guardarDenuncia = async (req, res) => {
    const usuarioId = req.uid;
    const { publicacionId, motivo, detalles } = req.body;
  
    try {
      // Verificar si la publicación existe
      const publicacion = await Publicacion.findById(publicacionId);
      if (!publicacion) {
        return res.status(404).json({
          ok: false,
          msg: "La publicación no fue encontrada",
        });
      }
  
      // Verificar si el usuario ya ha denunciado esta publicación
      const denunciaExistente = await Denuncia.findOne({
        publicacion: publicacionId,
        denunciante: usuarioId,
      });
  
      if (denunciaExistente) {
        return res.status(400).json({
          ok: false,
          msg: "Ya has denunciado esta publicación anteriormente",
        });
      }
  
      // Crear la denuncia
      const denuncia = new Denuncia({
        publicacion: publicacionId,
        motivo,
        detalles,
        denunciante: usuarioId,
      });
  
      await denuncia.save();
  
      res.json({
        ok: true,
        denuncia,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: "Por favor hable con el administrador",
      });
    }
  };
  

const obtenerDenuncias = async (req, res) => {
    try {
        const denuncias = await Denuncia.find()
            .populate("publicacion", "titulo")
            .populate("denunciante", "nombre")
            .sort({ fecha: -1 });

        res.json({
            ok: true,
            denuncias,
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
  guardarDenuncia,
};
