const { Schema, model } = require("mongoose");

const PublicacionSchema = Schema(
  {
    titulo: {
      type: String,
      required: true,
    },
    contenido: {
      type: String,
      required: true,
    },

    color: {
      type: String,
      required: true,
    },
    ciudad: {
      type: String,
      required: true,
    },
    barrio: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    nombreUsuario: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
      },
    ],
    //lista de imagenes
    imagenes: [
      {
        type: String,
      },
    ],
    latitud: {
      type: Number,
    },
    longitud: {
      type: Number,
    },
    comentarios: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comentario",
      },
    ],
    imgAlerta: {
      type: String,
      required: true,
    },

    isLiked: {
      type: Boolean,
      default: false,
    },
    isActivo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

PublicacionSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model("Publicacion", PublicacionSchema);
