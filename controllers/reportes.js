
const { Publicacion } = require("../models");
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
      if (parametrosBusqueda[key] !== '') {
        consulta[key] = parametrosBusqueda[key];
      }
    });
    const publicaciones = await Publicacion.find( consulta );
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
    const publicaciones = await Publicacion.find( consulta );
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
      if (parametrosBusqueda[key] !== '') {
        consulta[key] = parametrosBusqueda[key];
      }
    });
    const publicaciones = await Publicacion.find( consulta );
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

const obtenerReporteBarras = async (req, res) => {
  let emergencias = [];
  let consulta = {};
  try {
    const parametrosBusqueda = req.body;
    Object.keys(parametrosBusqueda).forEach(key => {
      if (parametrosBusqueda[key] !== '') {
        consulta[key] = parametrosBusqueda[key];
      }
    });

    if (parametrosBusqueda.horaFin !== '') {
      const horaFin = parseInt(parametrosBusqueda.horaFin);
      consulta.$expr = {
        $and: [
          { $lte: [{ $hour: '$createdAt' }, horaFin] }
        ]
      };
    }
    
    if (parametrosBusqueda.horaInicio !== '') {
      const horaInicio = parseInt(parametrosBusqueda.horaInicio);
      if (!consulta.$expr) {
        consulta.$expr = {};
      }
      consulta.$expr.$and = consulta.$expr.$and || [];
      consulta.$expr.$and.push({ $gte: [{ $hour: '$createdAt' }, horaInicio] });
    }
    
    if (parametrosBusqueda.mes !== '') {
      const mes = parseInt(parametrosBusqueda.mes);
      if (!consulta.$expr) {
        consulta.$expr = {};
      }
      consulta.$expr.$and = consulta.$expr.$and || [];
      consulta.$expr.$and.push({ $eq: [{ $month: '$createdAt' }, mes] });
    }
    
    if (parametrosBusqueda.dia !== '') {
      const diaSemana = parseInt(parametrosBusqueda.dia);
      if (!consulta.$expr) {
        consulta.$expr = {};
      }
      consulta.$expr.$and = consulta.$expr.$and || [];
      consulta.$expr.$and.push({ $eq: [{ $dayOfWeek: '$createdAt' }, diaSemana] });
    }

    const publicaciones = await Publicacion.find( consulta);
    const conteoPorMes = {};
    emergencias =  publicaciones.forEach(publicacion => {
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
      if (parametrosBusqueda[key] !== '') {
        consulta[key] = parametrosBusqueda[key];
      }
    });

    if (parametrosBusqueda.horaFin !== '') {
      const horaFin = parseInt(parametrosBusqueda.horaFin);
      consulta.$expr = {
        $and: [
          { $lte: [{ $hour: '$createdAt' }, horaFin] }
        ]
      };
    }
    
    if (parametrosBusqueda.horaInicio !== '') {
      const horaInicio = parseInt(parametrosBusqueda.horaInicio);
      if (!consulta.$expr) {
        consulta.$expr = {};
      }
      consulta.$expr.$and = consulta.$expr.$and || [];
      consulta.$expr.$and.push({ $gte: [{ $hour: '$createdAt' }, horaInicio] });
    }
    
    if (parametrosBusqueda.mes !== '') {
      const mes = parseInt(parametrosBusqueda.mes);
      if (!consulta.$expr) {
        consulta.$expr = {};
      }
      consulta.$expr.$and = consulta.$expr.$and || [];
      consulta.$expr.$and.push({ $eq: [{ $month: '$createdAt' }, mes] });
    }
    
    if (parametrosBusqueda.dia !== '') {
      const diaSemana = parseInt(parametrosBusqueda.dia);
      if (!consulta.$expr) {
        consulta.$expr = {};
      }
      consulta.$expr.$and = consulta.$expr.$and || [];
      consulta.$expr.$and.push({ $eq: [{ $dayOfWeek: '$createdAt' }, diaSemana] });
    }

    const publicaciones = await Publicacion.find(consulta );
    emergencias = publicaciones.forEach(publicacion => {
      const { titulo } = publicacion;
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


module.exports = {
  obtenerCiudades,obtenerBarrios,obtenerEmergencias,obtenerAnios,obtenerReporteBarras,obtenerReportePastel
};
