const path = require("path");
const { v4: uuidv4 } = require("uuid");

const subirArchivoUsuario = (
  archivo,
  extensionesValidas = ["png", "jpg", "jpeg", "gif"],
  carpeta = ""
) => {

  return new Promise((resolve, reject) => {
    // console.log(archivo);
    const nombreCortado = archivo.archivo.name.split(".");
    console.log(nombreCortado);
    const extension = nombreCortado[nombreCortado.length - 1];

    // Validar la extension
    // if (!extensionesValidas.includes(extension)) {
    //   return reject(
    //     `La extensión ${extension} no es permitida - ${extensionesValidas}`
    //   );
    // }

    const nombreTemp = uuidv4() + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/", carpeta, nombreTemp);

    archivo.archivo.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve(nombreTemp);
    });
  });
};

const subirArchivoPublicacion = (
  archivo,
  extensionesValidas = ["png", "jpg", "jpeg", "gif"],
  carpeta = ""
) => {
  return new Promise((resolve, reject) => {
    // console.log(archivo);
    const nombreCortado = archivo.name.split(".");
    const extension = nombreCortado[nombreCortado.length - 1];

    // Validar la extensionssssss
    if (!extensionesValidas.includes(extension)) {
      return reject(
        `La extensión ${extension} no es permitida - ${extensionesValidas}`
      );
    }

    const nombreTemp = uuidv4() + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/", carpeta, nombreTemp);

    archivo.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve(nombreTemp);
    });
  });
};

module.exports = {
  subirArchivoUsuario,
  subirArchivoPublicacion
};
