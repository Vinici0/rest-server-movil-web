const generarCodigoUnico = () => {
  const codigoNumerico = Math.floor(Math.random() * 999999); // Genera un número aleatorio entre 0 y 999999
  const codigo = codigoNumerico.toString().padStart(6, "0"); // Convierte el número en una cadena de 6 caracteres rellenada con ceros a la izquierda si es necesario
  const codigoConGuion = `${codigo.substr(0, 3)}-${codigo.substr(3)}`; // Agrega el guión al medio del código
  return codigoConGuion;
};

const generarColorAleatorio = () => {
  const colorBase = "6165FA"; // El color principal de la aplicación en formato hexadecimal (sin el prefijo 0xFF)

  let color = "#";

  // Generar dos valores hexadecimales aleatorios para cada uno de los tres componentes de color (rojo, verde y azul)
  for (let i = 0; i < 3; i++) {
    const componente = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");
    color += componente;
  }

  return color;
};

module.exports = {
  generarCodigoUnico,
  generarColorAleatorio,
};
