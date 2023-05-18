const { Schema, model } = require("mongoose");

const PublicacionSchema = Schema({
  titulo: {
    type: String,
    required: true,
  },
  contenido: {
    type: String,
    required: true,
  },
  tipo : {
    type: String,
    required: true,
    // enum: ["publicado", "borrador"],
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  img: {
    type: String,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

PublicacionSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model("Publicacion", PublicacionSchema);
