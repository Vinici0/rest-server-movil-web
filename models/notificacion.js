const mongoose = require('mongoose');

const NotificacionSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      enum: ['publicacion', 'sos'],
      required: true,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    publicacion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Publicacion',
    },
    telefonoUsuario: {
      type: String,
    },
    mensaje: {
      type: String,
      required: true,
    },
    leidaPorUsuario: [
      {
        usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
        leida: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);


NotificacionSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});


module.exports = mongoose.model('Notificacion', NotificacionSchema);
