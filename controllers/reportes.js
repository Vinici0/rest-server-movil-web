const {
  Publicacion,
  Usuario
} = require("../models");
const fs = require('fs');
const PDFDocument = require('pdfkit');
const pdfMakePrinter = require('pdfmake/src/printer');
const pdfMakeUni = require('pdfmake-unicode');
const ExcelJS = require('exceljs');
const publicacion = require("../models/publicacion");
const obtenerCiudades = async (req, res) => {
  let ciudades = [];
  try {
    let publicaciones = await Publicacion.find();
    ciudades = Array.from(new Set(publicaciones.map(publicacion => publicacion['ciudad'])));

    res.json({
      ok: true,
      msg: "Ciudades obtenidas correctamente",
      data: ciudades
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const obtenerBarrios = async (req, res) => {
  let barrios = [];
  let consulta = {};
  try {
    const parametrosBusqueda = req.body;
    Object.keys(parametrosBusqueda).forEach(key => {
      if (parametrosBusqueda[key] !== '' && parametrosBusqueda[key] !== undefined) {
        consulta[key] = parametrosBusqueda[key];
      }
    });
    let publicaciones = await Publicacion.find(consulta);
    if (parametrosBusqueda.horaFin != undefined && parametrosBusqueda.horaFin.includes(':')) {
      const FechahoraFin = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaFin));
      const horaFin = FechahoraFin.getHours();
      const minutosFin = FechahoraFin.getMinutes();
      const documentosHoraFin = publicaciones.filter((publicacion) => {
        const hora = publicacion.createdAt.getHours();
        const minutos = publicacion.createdAt.getMinutes();

        return (hora < horaFin || (hora === horaFin && minutos <= minutosFin));
      });
      publicaciones = documentosHoraFin
    }

    if (parametrosBusqueda.horaInicio != undefined && parametrosBusqueda.horaInicio.includes(':')) {
      const FechahoraInicio = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaInicio));
      const horaInicio = FechahoraInicio.getHours();
      const minutosInicio = FechahoraInicio.getMinutes();
      const documentosHoraInicio = publicaciones.filter((publicacion) => {
        const hora = publicacion.createdAt.getHours();
        const minutos = publicacion.createdAt.getMinutes();
        return (hora > horaInicio || (hora === horaInicio && minutos >= minutosInicio));
      });
      publicaciones = documentosHoraInicio
    }


    barrios = Array.from(new Set(publicaciones.map(publicacion => publicacion['barrio'])));
    res.json({
      ok: true,
      msg: "Barrios obtenidos correctamente",
      data: barrios
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
}

const obtenerDatosCards = async (req, res) => {
  let publicacionesRegistradas = 0;
  let usuariosRegistros = 0;
  let publicacionesDelMes = 0;
  let publicacionesDelDia = 0;
  try {
    let publicaciones = await Publicacion.find();
    const usuarios = await Usuario.find();
    publicacionesRegistradas = publicaciones.length;
    usuariosRegistros = usuarios.length;
    const fechaActual = new Date();

    // Calcula el primer día del mes actual
    const primerDiaMesActual = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);

    // Calcula el último día del mes actual
    const ultimoDiaMesActual = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);

    // Consulta las publicaciones que se encuentran dentro del rango del mes actual
    publicacionesDelMes = await Publicacion.countDocuments({
      createdAt: {
        $gte: primerDiaMesActual,
        $lte: ultimoDiaMesActual
      },
    });

    const fechaInicioDiaActual = new Date();
    fechaInicioDiaActual.setHours(0, 0, 0, 0);

    // Obtenemos la fecha de fin del día actual
    const fechaFinDiaActual = new Date();
    fechaFinDiaActual.setHours(23, 59, 59, 999);


    // Realizamos la consulta a la base de datos para obtener el conteo
    publicacionesDelDia = await Publicacion.countDocuments({
      createdAt: {
        $gte: fechaInicioDiaActual,
        $lte: fechaFinDiaActual,
      },
    });
    res.json({
      ok: true,
      msg: "Barrios obtenidos correctamente",
      data: {
        publicacionesRegistradas,
        usuariosRegistros,
        publicacionesDelMes,
        publicacionesDelDia
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
}

const obtenerAnios = async (req, res) => {
  let anios = [];
  let consulta = {};
  try {
    const parametrosBusqueda = req.body;
    Object.keys(parametrosBusqueda).forEach(key => {
      if (parametrosBusqueda[key] != '') {
        consulta[key] = parametrosBusqueda[key];
      }
    });
    let publicaciones = await Publicacion.find(consulta);
    if (parametrosBusqueda.horaFin != undefined && parametrosBusqueda.horaFin.includes(':')) {
      const FechahoraFin = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaFin));
      const horaFin = FechahoraFin.getHours();
      const minutosFin = FechahoraFin.getMinutes();
      const documentosHoraFin = publicaciones.filter((publicacion) => {
        const hora = publicacion.createdAt.getHours();
        const minutos = publicacion.createdAt.getMinutes();

        return (hora < horaFin || (hora === horaFin && minutos <= minutosFin));
      });
      publicaciones = documentosHoraFin
    }

    if (parametrosBusqueda.horaInicio != undefined && parametrosBusqueda.horaInicio.includes(':')) {
      const FechahoraInicio = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaInicio));
      const horaInicio = FechahoraInicio.getHours();
      const minutosInicio = FechahoraInicio.getMinutes();
      const documentosHoraInicio = publicaciones.filter((publicacion) => {
        const hora = publicacion.createdAt.getHours();
        const minutos = publicacion.createdAt.getMinutes();
        return (hora > horaInicio || (hora === horaInicio && minutos >= minutosInicio));
      });
      publicaciones = documentosHoraInicio
    }


    anios = Array.from(new Set(publicaciones.map(publicacion => new Date(publicacion.createdAt).getFullYear())));
    res.json({
      ok: true,
      msg: "Años obtenidos correctamente",
      data: anios
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const obtenerEmergencias = async (req, res) => {
  let emergencias = [];
  let consulta = {};
  try {
    const parametrosBusqueda = req.body;
    Object.keys(parametrosBusqueda).forEach(key => {
      if (parametrosBusqueda[key] !== '' && parametrosBusqueda[key] !== undefined) {
        consulta[key] = parametrosBusqueda[key];
      }
    });
    let publicaciones = await Publicacion.find(consulta);
    if (parametrosBusqueda.horaFin != undefined && parametrosBusqueda.horaFin.includes(':')) {
      const FechahoraFin = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaFin));
      const horaFin = FechahoraFin.getHours();
      const minutosFin = FechahoraFin.getMinutes();
      const documentosHoraFin = publicaciones.filter((publicacion) => {
        const hora = publicacion.createdAt.getHours();
        const minutos = publicacion.createdAt.getMinutes();

        return (hora < horaFin || (hora === horaFin && minutos <= minutosFin));
      });
      publicaciones = documentosHoraFin
    }

    if (parametrosBusqueda.horaInicio != undefined && parametrosBusqueda.horaInicio.includes(':')) {
      const FechahoraInicio = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaInicio));
      const horaInicio = FechahoraInicio.getHours();
      const minutosInicio = FechahoraInicio.getMinutes();
      const documentosHoraInicio = publicaciones.filter((publicacion) => {
        const hora = publicacion.createdAt.getHours();
        const minutos = publicacion.createdAt.getMinutes();
        return (hora > horaInicio || (hora === horaInicio && minutos >= minutosInicio));
      });
      publicaciones = documentosHoraInicio
    }


    emergencias = Array.from(new Set(publicaciones.map(publicacion => publicacion['titulo'])));
    res.json({
      ok: true,
      msg: "Emergencias obtenidas correctamente",
      data: emergencias
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};
const convertToEcuadorTimeZone = (date) => {
  const ecuadorTimeZoneOffset = -5 * 60; // -5 horas en minutos
  const userTimeZoneOffset = date.getTimezoneOffset(); // Obtener el offset del huso horario del usuario en minutos
  const gmtTime = date.getTime() + userTimeZoneOffset * 60 * 1000; // Convertir la hora a GMT
  const ecuadorTime = gmtTime + ecuadorTimeZoneOffset * 60 * 1000; // Agregar el offset de GMT-5
  return new Date(ecuadorTime);
};
const obtenerReporteBarras = async (req, res) => {
  let emergencias = [];
  let consulta = {};
  try {
    const parametrosBusqueda = req.body;

    Object.keys(parametrosBusqueda).forEach(key => {
      if (parametrosBusqueda[key] !== '' && parametrosBusqueda[key] !== undefined) {
        consulta[key] = parametrosBusqueda[key];
      }
    });






    if (parametrosBusqueda.fechaFin) {
      const fechaFin = new Date(parametrosBusqueda.fechaFin);
      fechaFin.setHours(23, 59, 59); // Establecer la hora de finalización a las 23:59:59
      consulta.createdAt = consulta.createdAt || {};
      consulta.createdAt.$lte = fechaFin;
    }

    if (parametrosBusqueda.fechaInicio) {
      const fechaInicio = new Date(parametrosBusqueda.fechaInicio);
      consulta.createdAt = consulta.createdAt || {};
      consulta.createdAt.$gte = fechaInicio;
    }



    let publicaciones = await Publicacion.find(consulta);

    if (parametrosBusqueda.horaFin != undefined && parametrosBusqueda.horaFin.includes(':')) {
      const FechahoraFin = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaFin));
      const horaFin = FechahoraFin.getHours();
      const minutosFin = FechahoraFin.getMinutes();
      const documentosHoraFin = publicaciones.filter((publicacion) => {
        const hora = publicacion.createdAt.getHours();
        const minutos = publicacion.createdAt.getMinutes();

        return (hora < horaFin || (hora === horaFin && minutos <= minutosFin));
      });
      publicaciones = documentosHoraFin
    }

    if (parametrosBusqueda.horaInicio != undefined && parametrosBusqueda.horaInicio.includes(':')) {
      const FechahoraInicio = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaInicio));
      const horaInicio = FechahoraInicio.getHours();
      const minutosInicio = FechahoraInicio.getMinutes();
      const documentosHoraInicio = publicaciones.filter((publicacion) => {
        const hora = publicacion.createdAt.getHours();
        const minutos = publicacion.createdAt.getMinutes();
        return (hora > horaInicio || (hora === horaInicio && minutos >= minutosInicio));
      });
      publicaciones = documentosHoraInicio
    }

    const conteoPorMes = {};
    for (let index = (new Date(parametrosBusqueda.fechaInicio).getMonth()); index <= ((new Date(parametrosBusqueda.fechaFin).getMonth())); index++) {
      conteoPorMes[index] = 0;

    }


    publicaciones.forEach(publicacion => {
      const fecha = new Date(publicacion.createdAt);
      const mes = fecha.getMonth() + 1; // Los meses en JavaScript se representan del 0 al 11, por eso sumamos 1.

      if (conteoPorMes[mes]) {
        conteoPorMes[mes]++;
      } else {
        conteoPorMes[mes] = 1;
      }
    });

    res.json({
      ok: true,
      msg: "Datos para barras obtenidas correctamente",
      data: conteoPorMes
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};
const obtenerReportePastel = async (req, res) => {
  const conteoEmergencias = {};
  let consulta = {};
  try {
    const parametrosBusqueda = req.body;
    Object.keys(parametrosBusqueda).forEach(key => {
      if (parametrosBusqueda[key] !== '' && parametrosBusqueda[key] !== undefined) {
        consulta[key] = parametrosBusqueda[key];
      }
    });






    if (parametrosBusqueda.fechaFin) {
      const fechaFin = new Date(parametrosBusqueda.fechaFin);
      fechaFin.setHours(23, 59, 59); // Establecer la hora de finalización a las 23:59:59
      consulta.createdAt = consulta.createdAt || {};
      consulta.createdAt.$lte = fechaFin;
    }

    if (parametrosBusqueda.fechaInicio) {
      const fechaInicio = new Date(parametrosBusqueda.fechaInicio);
      consulta.createdAt = consulta.createdAt || {};
      consulta.createdAt.$gte = fechaInicio;
    }


    let publicaciones = await Publicacion.find(consulta);
    if (parametrosBusqueda.horaFin != undefined && parametrosBusqueda.horaFin.includes(':')) {
      const FechahoraFin = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaFin));
      const horaFin = FechahoraFin.getHours();
      const minutosFin = FechahoraFin.getMinutes();
      const documentosHoraFin = publicaciones.filter((publicacion) => {
        const hora = publicacion.createdAt.getHours();
        const minutos = publicacion.createdAt.getMinutes();

        return (hora < horaFin || (hora === horaFin && minutos <= minutosFin));
      });
      publicaciones = documentosHoraFin
    }

    if (parametrosBusqueda.horaInicio != undefined && parametrosBusqueda.horaInicio.includes(':')) {
      const FechahoraInicio = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaInicio));
      const horaInicio = FechahoraInicio.getHours();
      const minutosInicio = FechahoraInicio.getMinutes();
      const documentosHoraInicio = publicaciones.filter((publicacion) => {
        const hora = publicacion.createdAt.getHours();
        const minutos = publicacion.createdAt.getMinutes();
        return (hora > horaInicio || (hora === horaInicio && minutos >= minutosInicio));
      });
      publicaciones = documentosHoraInicio
    }


    emergencias = publicaciones.forEach(publicacion => {
      const {
        titulo
      } = publicacion;
      if (conteoEmergencias[titulo]) {
        conteoEmergencias[titulo]++;
      } else {
        conteoEmergencias[titulo] = 1;
      }
    });
    res.json({
      ok: true,
      msg: "Datos de pastel",
      data: conteoEmergencias
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};
const obtenerMapaCalor = async (req, res) => {
  let consulta = {};
  try {
    const parametrosBusqueda = req.body;
    Object.keys(parametrosBusqueda).forEach(key => {
      if (parametrosBusqueda[key] !== '' && parametrosBusqueda[key] !== undefined) {
        consulta[key] = parametrosBusqueda[key];
      }
    });






    if (parametrosBusqueda.fechaFin) {
      const fechaFin = new Date(parametrosBusqueda.fechaFin);
      fechaFin.setHours(23, 59, 59); // Establecer la hora de finalización a las 23:59:59
      consulta.createdAt = consulta.createdAt || {};
      consulta.createdAt.$lte = fechaFin;
    }

    if (parametrosBusqueda.fechaInicio) {
      const fechaInicio = new Date(parametrosBusqueda.fechaInicio);
      consulta.createdAt = consulta.createdAt || {};
      consulta.createdAt.$gte = fechaInicio;
    }


    let publicaciones = await Publicacion.find(consulta);
    if (parametrosBusqueda.horaFin != undefined && parametrosBusqueda.horaFin.includes(':')) {
      const FechahoraFin = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaFin));
      const horaFin = FechahoraFin.getHours();
      const minutosFin = FechahoraFin.getMinutes();
      const documentosHoraFin = publicaciones.filter((publicacion) => {
        const hora = publicacion.createdAt.getHours();
        const minutos = publicacion.createdAt.getMinutes();

        return (hora < horaFin || (hora === horaFin && minutos <= minutosFin));
      });
      publicaciones = documentosHoraFin
    }

    if (parametrosBusqueda.horaInicio != undefined && parametrosBusqueda.horaInicio.includes(':')) {
      const FechahoraInicio = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaInicio));
      const horaInicio = FechahoraInicio.getHours();
      const minutosInicio = FechahoraInicio.getMinutes();
      const documentosHoraInicio = publicaciones.filter((publicacion) => {
        const hora = publicacion.createdAt.getHours();
        const minutos = publicacion.createdAt.getMinutes();
        return (hora > horaInicio || (hora === horaInicio && minutos >= minutosInicio));
      });
      publicaciones = documentosHoraInicio
    }


    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const heatmapData = Array.from({
      length: 7
    }, () => ({
      name: '',
      data: Array(24).fill(0)
    }));

    diasSemana.map((diaSemana, index) => {
      heatmapData[index].name = diasSemana[index];
    });

    publicaciones.forEach((publicacion) => {
      const fecha = new Date(publicacion.createdAt);
      const diaSemana = fecha.getDay();
      const hora = fecha.getHours();

      heatmapData[diaSemana].name = diasSemana[diaSemana];
      heatmapData[diaSemana].data[hora] += 1;
    });

    let maxCount = 0;

    heatmapData.forEach((data, index) => {
      const maxInDay = Math.max(...data.data);
      if (maxInDay > maxCount) {
        maxCount = maxInDay;
      }
    });
    const segmentSize = Math.ceil(maxCount / 3);
    const ranges = [{
        from: 1,
        to: segmentSize,
        name: 'Bajo',
        color: '#008FFB'
      },
      {
        from: segmentSize + 1,
        to: segmentSize * 2,
        name: 'Medio',
        color: '#efa94a'
      },
      {
        from: segmentSize * 2 + 1,
        to: maxCount,
        name: 'Alto',
        color: '#FF4560'
      },
    ];


    res.json({
      ok: true,
      msg: "Datos de mapa  de calor",
      data: {
        heatmapData,
        ranges,
        total: publicaciones.length
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};
const obtenerCoordenadas = async (req, res) => {
  let consulta = {};
  try {
    const parametrosBusqueda = req.body;
    Object.keys(parametrosBusqueda).forEach(key => {
      if (parametrosBusqueda[key] !== '' && parametrosBusqueda[key] !== undefined) {
        consulta[key] = parametrosBusqueda[key];
      }
    });






    if (parametrosBusqueda.fechaFin) {
      const fechaFin = new Date(parametrosBusqueda.fechaFin);
      fechaFin.setHours(23, 59, 59); // Establecer la hora de finalización a las 23:59:59
      consulta.createdAt = consulta.createdAt || {};
      consulta.createdAt.$lte = fechaFin;
    }

    if (parametrosBusqueda.fechaInicio) {
      const fechaInicio = new Date(parametrosBusqueda.fechaInicio);
      consulta.createdAt = consulta.createdAt || {};
      consulta.createdAt.$gte = fechaInicio;
    }


    let publicaciones = await Publicacion.find(consulta);
    if (parametrosBusqueda.horaFin != undefined && parametrosBusqueda.horaFin.includes(':')) {
      const FechahoraFin = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaFin));
      const horaFin = FechahoraFin.getHours();
      const minutosFin = FechahoraFin.getMinutes();
      const documentosHoraFin = publicaciones.filter((publicacion) => {
        const hora = publicacion.createdAt.getHours();
        const minutos = publicacion.createdAt.getMinutes();

        return (hora < horaFin || (hora === horaFin && minutos <= minutosFin));
      });
      publicaciones = documentosHoraFin
    }

    if (parametrosBusqueda.horaInicio != undefined && parametrosBusqueda.horaInicio.includes(':')) {
      const FechahoraInicio = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaInicio));
      const horaInicio = FechahoraInicio.getHours();
      const minutosInicio = FechahoraInicio.getMinutes();
      const documentosHoraInicio = publicaciones.filter((publicacion) => {
        const hora = publicacion.createdAt.getHours();
        const minutos = publicacion.createdAt.getMinutes();
        return (hora > horaInicio || (hora === horaInicio && minutos >= minutosInicio));
      });
      publicaciones = documentosHoraInicio
    }



    const coordenadas = publicaciones.map(publicacion => {
      return {
        titulo: publicacion.titulo,
        position: [publicacion.latitud, publicacion.longitud]
      }
    });



    res.json({
      ok: true,
      msg: "Datos de mapa  de calor",
      data: coordenadas
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};


const descargarXLSX = async (req, res) => {
  let consulta = {};
  try {
    const parametrosBusqueda = req.body;
    Object.keys(parametrosBusqueda).forEach(key => {
      if (parametrosBusqueda[key] !== '' && parametrosBusqueda[key] !== undefined) {
        consulta[key] = parametrosBusqueda[key];
      }
    });






    if (parametrosBusqueda.fechaFin) {
      const fechaFin = new Date(parametrosBusqueda.fechaFin);
      fechaFin.setHours(23, 59, 59); // Establecer la hora de finalización a las 23:59:59
      consulta.createdAt = consulta.createdAt || {};
      consulta.createdAt.$lte = fechaFin;
    }

    if (parametrosBusqueda.fechaInicio) {
      const fechaInicio = new Date(parametrosBusqueda.fechaInicio);
      consulta.createdAt = consulta.createdAt || {};
      consulta.createdAt.$gte = fechaInicio;
    }


    let publicaciones = await Publicacion.find(consulta);
    if (parametrosBusqueda.horaFin != undefined && parametrosBusqueda.horaFin.includes(':')) {
      const FechahoraFin = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaFin));
      const horaFin = FechahoraFin.getHours();
      const minutosFin = FechahoraFin.getMinutes();
      const documentosHoraFin = publicaciones.filter((publicacion) => {
        const hora = publicacion.createdAt.getHours();
        const minutos = publicacion.createdAt.getMinutes();

        return (hora < horaFin || (hora === horaFin && minutos <= minutosFin));
      });
      publicaciones = documentosHoraFin
    }

    if (parametrosBusqueda.horaInicio != undefined && parametrosBusqueda.horaInicio.includes(':')) {
      const FechahoraInicio = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaInicio));
      const horaInicio = FechahoraInicio.getHours();
      const minutosInicio = FechahoraInicio.getMinutes();
      const documentosHoraInicio = publicaciones.filter((publicacion) => {
        const hora = publicacion.createdAt.getHours();
        const minutos = publicacion.createdAt.getMinutes();
        return (hora > horaInicio || (hora === horaInicio && minutos >= minutosInicio));
      });
      publicaciones = documentosHoraInicio
    }


    exportToExcel(publicaciones)
      .then((buffer) => {
        // Configurar las cabeceras para la descarga del archivo
        res.setHeader('Content-Disposition', 'attachment; filename=datos.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // Enviar el archivo de Excel como respuesta
        res.send(buffer);
      })
      .catch((error) => {
        console.error('Error al generar el archivo de Excel:', error);
        res.status(500).send('Error al generar el archivo de Excel.');
      });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const descargarCSV = async (req, res) => {
  let consulta = {};
  try {
    const parametrosBusqueda = req.body;
    Object.keys(parametrosBusqueda).forEach(key => {
      if (parametrosBusqueda[key] !== '' && parametrosBusqueda[key] !== undefined) {
        consulta[key] = parametrosBusqueda[key];
      }
    });






    if (parametrosBusqueda.fechaFin) {
      const fechaFin = new Date(parametrosBusqueda.fechaFin);
      fechaFin.setHours(23, 59, 59); // Establecer la hora de finalización a las 23:59:59
      consulta.createdAt = consulta.createdAt || {};
      consulta.createdAt.$lte = fechaFin;
    }

    if (parametrosBusqueda.fechaInicio) {
      const fechaInicio = new Date(parametrosBusqueda.fechaInicio);
      consulta.createdAt = consulta.createdAt || {};
      consulta.createdAt.$gte = fechaInicio;
    }


    let publicaciones = await Publicacion.find(consulta);
    if (parametrosBusqueda.horaFin != undefined && parametrosBusqueda.horaFin.includes(':')) {
      const FechahoraFin = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaFin));
      const horaFin = FechahoraFin.getHours();
      const minutosFin = FechahoraFin.getMinutes();
      const documentosHoraFin = publicaciones.filter((publicacion) => {
        const hora = publicacion.createdAt.getHours();
        const minutos = publicacion.createdAt.getMinutes();

        return (hora < horaFin || (hora === horaFin && minutos <= minutosFin));
      });
      publicaciones = documentosHoraFin
    }

    if (parametrosBusqueda.horaInicio != undefined && parametrosBusqueda.horaInicio.includes(':')) {
      const FechahoraInicio = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaInicio));
      const horaInicio = FechahoraInicio.getHours();
      const minutosInicio = FechahoraInicio.getMinutes();
      const documentosHoraInicio = publicaciones.filter((publicacion) => {
        const hora = publicacion.createdAt.getHours();
        const minutos = publicacion.createdAt.getMinutes();
        return (hora > horaInicio || (hora === horaInicio && minutos >= minutosInicio));
      });
      publicaciones = documentosHoraInicio
    }


    exportToCSV(publicaciones)
      .then((buffer) => {
        // Configurar las cabeceras para la descarga del archivo
        res.setHeader('Content-Disposition', 'attachment; filename=datos.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // Enviar el archivo de Excel como respuesta
        res.send(buffer);
      })
      .catch((error) => {
        console.error('Error al generar el archivo de Excel:', error);
        res.status(500).send('Error al generar el archivo de Excel.');
      });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const descargarPDF = async (req, res) => {
  let consulta = {};
  try {
    const parametrosBusqueda = req.body;
    console.log(parametrosBusqueda);
    Object.keys(parametrosBusqueda).forEach(key => {
      if (parametrosBusqueda[key] !== '' && parametrosBusqueda[key] !== undefined) {
        consulta[key] = parametrosBusqueda[key];
      }
    });






    if (parametrosBusqueda.fechaFin) {
      const fechaFin = new Date(parametrosBusqueda.fechaFin);
      fechaFin.setHours(23, 59, 59); // Establecer la hora de finalización a las 23:59:59
      consulta.createdAt = consulta.createdAt || {};
      consulta.createdAt.$lte = fechaFin;
    }

    if (parametrosBusqueda.fechaInicio) {
      const fechaInicio = new Date(parametrosBusqueda.fechaInicio);
      consulta.createdAt = consulta.createdAt || {};
      consulta.createdAt.$gte = fechaInicio;
    }


    let publicaciones = await Publicacion.find(consulta);
    if (parametrosBusqueda.horaFin != undefined && parametrosBusqueda.horaFin.includes(':')) {
      const FechahoraFin = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaFin));
      const horaFin = FechahoraFin.getHours();
      const minutosFin = FechahoraFin.getMinutes();
      const documentosHoraFin = publicaciones.filter((publicacion) => {
        const hora = publicacion.createdAt.getHours();
        const minutos = publicacion.createdAt.getMinutes();

        return (hora < horaFin || (hora === horaFin && minutos <= minutosFin));
      });
      publicaciones = documentosHoraFin
    }

    if (parametrosBusqueda.horaInicio != undefined && parametrosBusqueda.horaInicio.includes(':')) {
      const FechahoraInicio = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaInicio));
      const horaInicio = FechahoraInicio.getHours();
      const minutosInicio = FechahoraInicio.getMinutes();
      const documentosHoraInicio = publicaciones.filter((publicacion) => {
        const hora = publicacion.createdAt.getHours();
        const minutos = publicacion.createdAt.getMinutes();
        return (hora > horaInicio || (hora === horaInicio && minutos >= minutosInicio));
      });
      publicaciones = documentosHoraInicio
    }

   // Configurar los encabezados de la respuesta para descargar el archivo PDF
   const filename = 'archivo.pdf';
   res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
   res.setHeader('Content-Type', 'application/pdf');
 
   // Obtener la ruta absoluta de las fuentes Roboto
   const fonts = {
    Roboto: {
      normal: require.resolve('pdfmake-unicode/src/fonts/Arial GEO/Roboto-Regular.ttf'),
      bold: require.resolve('pdfmake-unicode/src/fonts/Arial GEO/Roboto-Medium.ttf'),
     },
    
  };
 
   // Crear un objeto de definición de PDF utilizando pdfmake
   const printer = new pdfMakePrinter(fonts);
   const docDefinition = {
     content: [
       { text: 'Lista de Publicaciones', style: 'header' },
       {
         table: {
           headerRows: 1,
           widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
           body: [
             [{ text: 'Título', style: 'header2'}
             , { text: 'Contenido', style: 'header2'}
             , { text: 'Ciudad', style: 'header2'}
             , { text: 'Barrio', style: 'header2'}
             , { text: 'Nombre de Usuario',  style: 'header2'}
             , { text: 'Latitud', style: 'header2'}
             , { text: 'Longitud', style: 'header2'}
    
            ],
             ...publicaciones.map((publicacion) => [
               publicacion.titulo,
               publicacion.contenido,
               publicacion.ciudad,
               publicacion.barrio,
               publicacion.nombreUsuario,
               publicacion.latitud.toString(),
               publicacion.longitud.toString(),
             ]),
           ],
         },
       },
     ],
     styles: {
       header: {
         fontSize: 18,
         bold: true,
         alignment: 'center',
       },
       header2: {
         fontSize: 12,
         bold: true,
         alignment: 'center',
       },
     },
   };
 
   // Crear el documento PDF utilizando pdfmake
   const pdfDoc = printer.createPdfKitDocument(docDefinition);
   pdfDoc.pipe(res);
   pdfDoc.end();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }

};
// Función para exportar un array de objetos a Excel
async function exportToExcel(dataArray) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Datos');

  // Definir los encabezados de las columnas en la hoja de cálculo
  let objeto = dataArray[0]._doc
  delete objeto._id
  delete objeto.color
  delete objeto.isPublic
  delete objeto.usuario
  delete objeto.likes
  delete objeto.imagenes
  delete objeto.comentarios
  delete objeto.__v
  delete objeto.isActivo
  delete objeto.isLiked
  delete objeto.imgAlerta
  delete objeto.isPublicacionPendiente
  const columnHeaders = Object.keys(objeto);
  worksheet.addRow(columnHeaders);

  // Llenar la hoja de cálculo con los datos de los objetos
  dataArray.forEach((dataObj) => {
    let objeto = Object.values(dataObj)[2]
    delete objeto._id
    delete objeto.color
    delete objeto.isPublic
    delete objeto.usuario
    delete objeto.likes
    delete objeto.imagenes
    delete objeto.comentarios
    delete objeto.__v
    delete objeto.isActivo
    delete objeto.isLiked
    delete objeto.imgAlerta
    delete objeto.isPublicacionPendiente


    worksheet.addRow(Object.values(objeto));
  });
  worksheet.columns.forEach((column, index) => {
    let maxLength = 0;
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const cellValue = row.getCell(index + 1).value;
        if (cellValue && cellValue.toString().length > maxLength) {
          maxLength = cellValue.toString().length;
        }
      }
    });
    // Limitar el ancho de las celdas al máximo permitido (16384)
    column.width = Math.min(maxLength < 12 ? 12 : maxLength, 16384);
  });






  // Devolver el archivo de Excel como un buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}



// Función para exportar un array de objetos a Excel
async function exportToCSV(dataArray) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Datos');

  // Definir los encabezados de las columnas en la hoja de cálculo
  let objeto = dataArray[0]._doc
  const columnHeaders = Object.keys(objeto);
  worksheet.addRow(columnHeaders);

  // Llenar la hoja de cálculo con los datos de los objetos
  dataArray.forEach((dataObj) => {
    let objeto = Object.values(dataObj)[2]
    worksheet.addRow(Object.values(objeto));
  });
  worksheet.columns.forEach((column, index) => {
    let maxLength = 0;
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const cellValue = row.getCell(index + 1).value;
        if (cellValue && cellValue.toString().length > maxLength) {
          maxLength = cellValue.toString().length;
        }
      }
    });
    // Limitar el ancho de las celdas al máximo permitido (16384)
    column.width = Math.min(maxLength < 12 ? 12 : maxLength, 16384);
  });






  // Devolver el archivo de Excel como un buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}




module.exports = {
  obtenerCiudades,
  obtenerBarrios,
  obtenerEmergencias,
  obtenerAnios,
  obtenerReporteBarras,
  obtenerReportePastel,
  obtenerMapaCalor,
  obtenerDatosCards,
  obtenerCoordenadas,
  descargarXLSX,
  descargarPDF,
  descargarCSV

};