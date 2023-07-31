const {
  Publicacion,
  Usuario
} = require("../models");
const publicacion = require("../models/publicacion");
const obtenerCiudades = async (req, res) => {
  let ciudades = [];
  try {
    const publicaciones = await Publicacion.find();
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
    const publicaciones = await Publicacion.find(consulta);
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
    const publicaciones = await Publicacion.find();
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
    const publicaciones = await Publicacion.find(consulta);
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
    const publicaciones = await Publicacion.find(consulta);
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


    if (parametrosBusqueda.horaFin && parametrosBusqueda.horaFin.includes(':')) {
      const FechahoraFin = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaFin));
      const horaFin = FechahoraFin.getHours();
      const minutosFin = FechahoraFin.getMinutes();
      consulta.$expr = {
        $and: [
          [{
            $hour: '$createdAt'
          }, horaFin],
          [{
            $minute: '$createdAt'
          }, minutosFin]
        ]
      };
    }

    if (parametrosBusqueda.horaInicio && parametrosBusqueda.horaInicio.includes(':')) {
      const FechahoraInicio = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaInicio));
      const horaInicio = FechahoraInicio.getHours();
      const minutosInicio = FechahoraInicio.getMinutes();
      if (!consulta.$expr) {
        consulta.$expr = {};
      }
      consulta.$expr.$and = consulta.$expr.$and || [];
      consulta.$expr.$and.push(
        [{
          $hour: '$createdAt'
        }, horaInicio],
        [{
          $minute: '$createdAt'
        }, minutosInicio]
      );
    }



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



    const publicaciones = await Publicacion.find(consulta);
    const conteoPorMes = {};
    for (let index = (new Date(parametrosBusqueda.fechaInicio).getMonth()+1); index <= (new Date(parametrosBusqueda.fechaFin).getMonth()+1); index++) {
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


    if (parametrosBusqueda.horaFin && parametrosBusqueda.horaFin.includes(':')) {
      const FechahoraFin = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaFin));
      const horaFin = FechahoraFin.getHours();
      const minutosFin = FechahoraFin.getMinutes();
      consulta.$expr = {
        $and: [
          [{
            $hour: '$createdAt'
          }, horaFin],
          [{
            $minute: '$createdAt'
          }, minutosFin]
        ]
      };
    }

    if (parametrosBusqueda.horaInicio && parametrosBusqueda.horaInicio.includes(':')) {
      const FechahoraInicio = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaInicio));
      const horaInicio = FechahoraInicio.getHours();
      const minutosInicio = FechahoraInicio.getMinutes();
      if (!consulta.$expr) {
        consulta.$expr = {};
      }
      consulta.$expr.$and = consulta.$expr.$and || [];
      consulta.$expr.$and.push(
        [{
          $hour: '$createdAt'
        }, horaInicio],
        [{
          $minute: '$createdAt'
        }, minutosInicio]
      );
    }



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


    const publicaciones = await Publicacion.find(consulta);
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


    if (parametrosBusqueda.horaFin && parametrosBusqueda.horaFin.includes(':')) {
      const FechahoraFin = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaFin));
      const horaFin = FechahoraFin.getHours();
      const minutosFin = FechahoraFin.getMinutes();
      consulta.$expr = {
        $and: [
          [{
            $hour: '$createdAt'
          }, horaFin],
          [{
            $minute: '$createdAt'
          }, minutosFin]
        ]
      };
    }

    if (parametrosBusqueda.horaInicio && parametrosBusqueda.horaInicio.includes(':')) {
      const FechahoraInicio = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaInicio));
      const horaInicio = FechahoraInicio.getHours();
      const minutosInicio = FechahoraInicio.getMinutes();
      if (!consulta.$expr) {
        consulta.$expr = {};
      }
      consulta.$expr.$and = consulta.$expr.$and || [];
      consulta.$expr.$and.push(
        [{
          $hour: '$createdAt'
        }, horaInicio],
        [{
          $minute: '$createdAt'
        }, minutosInicio]
      );
    }



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


    const publicaciones = await Publicacion.find(consulta);
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


    if (parametrosBusqueda.horaFin && parametrosBusqueda.horaFin.includes(':')) {
      const FechahoraFin = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaFin));
      const horaFin = FechahoraFin.getHours();
      const minutosFin = FechahoraFin.getMinutes();
      consulta.$expr = {
        $and: [
          [{
            $hour: '$createdAt'
          }, horaFin],
          [{
            $minute: '$createdAt'
          }, minutosFin]
        ]
      };
    }

    if (parametrosBusqueda.horaInicio && parametrosBusqueda.horaInicio.includes(':')) {
      const FechahoraInicio = convertToEcuadorTimeZone(new Date(parametrosBusqueda.horaInicio));
      const horaInicio = FechahoraInicio.getHours();
      const minutosInicio = FechahoraInicio.getMinutes();
      if (!consulta.$expr) {
        consulta.$expr = {};
      }
      consulta.$expr.$and = consulta.$expr.$and || [];
      consulta.$expr.$and.push(
        [{
          $hour: '$createdAt'
        }, horaInicio],
        [{
          $minute: '$createdAt'
        }, minutosInicio]
      );
    }



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


    const publicaciones = await Publicacion.find(consulta);

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


module.exports = {
  obtenerCiudades,
  obtenerBarrios,
  obtenerEmergencias,
  obtenerAnios,
  obtenerReporteBarras,
  obtenerReportePastel,
  obtenerMapaCalor,
  obtenerDatosCards,
  obtenerCoordenadas

};