const path = require("path");
const fs = require("fs");

const { response } = require("express");
const { subirArchivoUsuario } = require("../helpers/subir-archivo");

const { Usuario, Publicacion } = require("../models");

const cargarArchivo = async (req, res = response) => {
  try {
    const nombres = [];
    for (const archivo of req.files.archivo) {
      const nombre = await subirArchivoUsuario(archivo, undefined, "imgs");
      nombres.push(nombre);
    }
    res.json({ nombres });
  } catch (msg) {
    res.status(400).json({ msg });
  }
};

const mostrarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;

  console.log(id, coleccion);
  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }

      break;

    case "publicaciones":
      modelo = await Publicacion.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }

      break;

    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  const idqury = req.query.imagenIndex;

  //si no se especifica el id de la imagen se muestra todas las imagenes

  // Limpiar imágenes previas
  if (modelo.imagenes) {
    //motrar imagen si concide con el id del arreglo de imagenes
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion + "/" + modelo.titulo.replace(/\s/g, ""),
      modelo.imagenes.find((img) => img === idqury)
    );

    console.log(pathImagen);

    if (fs.existsSync(pathImagen)) {
      //Sirve para verificar si existe el archivo en el path especificado
      return res.sendFile(pathImagen);
    }
  }

  const pathImagen = path.join(__dirname, "../assets/no-image.jpg");
  res.sendFile(pathImagen);
};

const mostrarAllImagenes = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;

    case "publicaciones":
      modelo = await Publicacion.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe una publicación con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  // Limpiar imágenes previas
  if (modelo.imagenes && modelo.imagenes.length > 0) {
    const pathImagenes = modelo.imagenes.map((imagenId) => {
      const pathImagen = path.join(
        __dirname,
        "../uploads",
        coleccion,
        imagenId
      );
      return fs.existsSync(pathImagen) ? pathImagen : null;
    });

    // Filtrar las rutas de imagen válidas
    const rutasValidas = pathImagenes.filter((ruta) => ruta !== null);

    if (rutasValidas.length > 0) {
      return res.json({ imagenes: rutasValidas });
    }
  }

  const pathImagen = path.join(__dirname, "../assets/no-image.jpg");

  res.sendFile(pathImagen);
};

const mostrarImagenUsuario = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }

      break;

    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  // Limpiar imágenes previas
  if (modelo.img) {
    // Hay que borrar la imagen del servidor
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );
    
    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    }
  }

  const pathImagen = path.join(__dirname, "../assets/no-image.jpg");
  res.sendFile(pathImagen);
};

const actualizarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }

      break;

    case "publicaciones":
      modelo = await Publicacion.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe una publicación con el id ${id}`,
        });
      }

      break;

    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  if (modelo.img) {
    // Hay que borrar la imagen del servidor
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );
    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }
  }

  const nombre = await subirArchivoUsuario(req.files, undefined, coleccion);
  modelo.img = nombre;

  await modelo.save();

  res.json(modelo);
};

module.exports = {
  cargarArchivo,
  mostrarImagen,
  mostrarAllImagenes,
  actualizarImagen,
  mostrarImagenUsuario,
};
