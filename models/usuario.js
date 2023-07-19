const { Schema, model } = require("mongoose");

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
  img: {
    type: String,
  },
  online: {
    type: Boolean,
    default: false,
  },
  tokenApp: {
    type: String,
    default: null,
  },
  google: {
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

UsuarioSchema.method("toJSON", function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model("Usuario", UsuarioSchema);
