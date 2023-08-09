const { Schema, model } = require("mongoose");

const NotificacionSchema = Schema(
  {
    tipo: {
      type: String,
      enum: ['publicacion', 'sos'],
      required: true,
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    //usuario que envia la notificacion
    usuarioRemitente: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
    },

    publicacion: {
      type: Schema.Types.ObjectId,
      ref: 'Publicacion',
    },
    telefonoUsuario: {
      type: String,
    },
    mensaje: {
      type: String,
      required: true,
    },
     latitud: {
      type: Number,
      required: true,
    },
    longitud: {
      type: Number,
      required: true,
    },
      isLeida: {
      type: Boolean,
      default: false,
      },
  },
  {
    timestamps: true,
  }
);


NotificacionSchema.method('toJSON', function () {
  const { __v, _id,...object } = this.toObject();
  object.uid = _id;  // Cambio aquí para mantener el campo _id
  return object;
});


module.exports =  model('Notificacion', NotificacionSchema);
