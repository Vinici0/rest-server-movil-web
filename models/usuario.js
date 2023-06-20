const { Schema, model } = require("mongoose");

// const DireccionSchema = Schema({
//   latitud: {
//     type: Number,
//     required: true,
//   },
//   longitud: {
//     type: Number,
//     required: true,
//   },
// });

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  ubicaciones: [
    {
      type: Schema.Types.ObjectId,
      ref: "Ubicacion",
    },
  ],
  telefono: {
    type: String,
  },
  telefonos : [
    {
      type: String,
    }
  ],
  online: {
    type: Boolean,
    default: false,
  },
  tokenApp: {
    type: String,
    default: null,
  },
});

UsuarioSchema.method("toJSON", function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model("Usuario", UsuarioSchema);
