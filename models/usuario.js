const { Schema, model } = require("mongoose");

const DireccionSchema = Schema({
  latitud: {
    type: Number,
    required: true,
  },
  longitud: {
    type: Number,
    required: true,
  },
});

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
  direcciones: [DireccionSchema],
  online: {
    type: Boolean,
    default: false,
  },
});

UsuarioSchema.method("toJSON", function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model("Usuario", UsuarioSchema);
