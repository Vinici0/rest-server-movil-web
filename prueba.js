const descargarPDF = async (req, res) => {
    let consulta = {};
    try {
      const parametrosBusqueda = req.body;
  
      Object.keys(parametrosBusqueda).forEach((key) => {
        if (
          parametrosBusqueda[key] !== "" &&
          parametrosBusqueda[key] !== undefined
        ) {
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
      if (
        parametrosBusqueda.horaFin != undefined &&
        parametrosBusqueda.horaFin.includes(":")
      ) {
        const FechahoraFin = convertToEcuadorTimeZone(
          new Date(parametrosBusqueda.horaFin)
        );
        const horaFin = FechahoraFin.getHours();
        const minutosFin = FechahoraFin.getMinutes();
        const documentosHoraFin = publicaciones.filter((publicacion) => {
          const hora = publicacion.createdAt.getHours();
          const minutos = publicacion.createdAt.getMinutes();
  
          return hora < horaFin || (hora === horaFin && minutos <= minutosFin);
        });
        publicaciones = documentosHoraFin;
      }
  
      if (
        parametrosBusqueda.horaInicio != undefined &&
        parametrosBusqueda.horaInicio.includes(":")
      ) {
        const FechahoraInicio = convertToEcuadorTimeZone(
          new Date(parametrosBusqueda.horaInicio)
        );
        const horaInicio = FechahoraInicio.getHours();
        const minutosInicio = FechahoraInicio.getMinutes();
        const documentosHoraInicio = publicaciones.filter((publicacion) => {
          const hora = publicacion.createdAt.getHours();
          const minutos = publicacion.createdAt.getMinutes();
          return (
            hora > horaInicio || (hora === horaInicio && minutos >= minutosInicio)
          );
        });
        publicaciones = documentosHoraInicio;
      }
  
      console.log(publicaciones);
  
  
  
      //TODO: total usuarios
      const totalUsuarios = await Usuario.countDocuments();
      console.log(totalUsuarios);//46
  
      //TODO: total publicaciones por dia, dia acutal
      const fechaActual = new Date();
  
      const fechaInicio = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate(), 0, 0, 0);
      const fechaFin = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate(), 23, 59, 59);
  
      const totalPublicacionesDia = await Publicacion.countDocuments({
        createdAt: {
          $gte: fechaInicio,
          $lte: fechaFin
        }
      });
      console.log(totalPublicacionesDia);//29
  
      //TODO: total publicaciones por MES, mes actual
      const fechaInicioMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1, 0, 0, 0);
      const fechaFinMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0, 23, 59, 59);
  
      const totalPublicacionesMes = await Publicacion.countDocuments({
        createdAt: {
          $gte: fechaInicioMes,
          $lte: fechaFinMes
        }
      });
  
      console.log(publicaciones);//29
  
  
          //taotal publicaciones registradas en el sistema
          const totalPublicacionesCoutn = await Publicacion.countDocuments();
  
  
          //objeto de persona con nombre y edad
          const dataInfo = {
            totalUsuarios: totalUsuarios,
            totalPublicacionesDia: totalPublicacionesDia,
            totalPublicacionesMes: totalPublicacionesMes,
            publicaciones: publicaciones,
            totalPublicacionesCoutn: totalPublicacionesCoutn
          }
      
  
  
      const pdfOptions = {
        childProcessOptions: {
          env: {
            OPENSSL_CONF: '/dev/null', // Configuración para evitar problemas SSL
          },
        },
      };
  
  
      const pdfFilePath = path.join(__dirname, '../../../uploads/datos.pdf'); // Ruta donde deseas guardar el PDF
  
      pdf.create(pdfTemplate(dataInfo), pdfOptions).toFile(pdfFilePath, (err) => {
        if (err) {
          console.log('Error creating PDF:', err);
          // Maneja el error de acuerdo a tus necesidades
          // res.send(Promise.reject());
        } else {
          console.log('PDF has been successfully created and saved.');
          // Realiza acciones adicionales si es necesario
          // res.send(Promise.resolve());
        }
      });
  
  
      // Configurar los encabezados de la respuesta para descargar el archivo PDF
      const filename = "archivo.pdf";
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Type", "application/pdf");
  
      // Obtener la ruta absoluta de las fuentes Roboto
      const fonts = {
        Roboto: {
          normal: require.resolve(
            "pdfmake-unicode/src/fonts/Arial GEO/Roboto-Regular.ttf"
          ),
          bold: require.resolve(
            "pdfmake-unicode/src/fonts/Arial GEO/Roboto-Medium.ttf"
          ),
        },
      };
  
      // Crear un objeto de definición de PDF utilizando pdfmake
      const printer = new pdfMakePrinter(fonts);
      const docDefinition = {
        content: [
          { text: "Lista de Publicaciones", style: "header" },
          {
            table: {
              headerRows: 1,
              widths: ["auto", "auto", "auto", "auto", "auto", "auto", "auto"],
              body: [
                [
                  { text: "Título", style: "header2" },
                  { text: "Contenido", style: "header2" },
                  { text: "Ciudad", style: "header2" },
                  { text: "Barrio", style: "header2" },
                  { text: "Nombre de Usuario", style: "header2" },
                  { text: "Latitud", style: "header2" },
                  { text: "Longitud", style: "header2" },
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
            alignment: "center",
          },
          header2: {
            fontSize: 12,
            bold: true,
            alignment: "center",
          },
        },
      };
  
   
  
  
      // const data =  path.join( __dirname, '../uploads/holaaa.pdf');
      // console.log(data);
      // // fs.writeFile(data, 'Hola mundo', (err) => {
      // //   if (err) throw err;
  
      // //   console.log('The file has been saved!');
      // // });
  
      // pdf.create(pdfTemplate(publicaciones), {}).toFile(data, (err) => {
      //   if (err) {
      //     res.send(Promise.reject());
      //   }
  
      //   res.send(Promise.resolve());
      // });
  
  
      // const pathText = path.join(__dirname, "../uploads/holaaa.txt");
      // fs.writeFile(pathText, "Hola mundo", (err) => {
      //   if (err) throw err;
  
      //   console.log("The file has been saved!");
      // });
  
  
  
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
    const worksheet = workbook.addWorksheet("Datos");
  
    // Definir los encabezados de las columnas en la hoja de cálculo
    console.log(dataArray);
    let objeto = dataArray[0]._doc;
    delete objeto._id;
    delete objeto.color;
    delete objeto.isPublic;
    delete objeto.usuario;
    delete objeto.likes;
    delete objeto.imagenes;
    delete objeto.comentarios;
    delete objeto.__v;
    delete objeto.isActivo;
    delete objeto.isLiked;
    delete objeto.imgAlerta;
    delete objeto.isPublicacionPendiente;
    delete objeto.updatedAt;
    delete objeto.fechaPublicacion;
  
    // Cambiar encabezado de createdAt por FechaCreacion
    objeto.FechaCreacion = objeto.createdAt;
    delete objeto.createdAt;
  
    // Cambiar los encabezados de las columnas a español y mayúsculas
    const headerTranslations = {
      titulo: "Tipo emergencia comunitaria",
      contenido: "Descripción de la emergencia",
      color: "Color",
      ciudad: "Ciudad",
      barrio: "Barrio",
      isPublic: "Es Público",
      usuario: "Usuario",
      nombreUsuario: "Nombre de Usuario",
      likes: "Likes",
      imagenes: "Imágenes",
      latitud: "Latitud",
      longitud: "Longitud",
      comentarios: "Comentarios",
      imgAlerta: "Imagen de Alerta",
      isLiked: "Es Favorito",
      isActivo: "Es Activo",
      FechaCreacion: "Fecha de publicación",
      isPublicacionPendiente: "Publicación Pendiente",
    };
  
    const columnHeaders = Object.keys(objeto).map(header => {
      if (headerTranslations.hasOwnProperty(header)) {
        return headerTranslations[header];
      } else {
        return header.charAt(0).toUpperCase() + header.slice(1);
      }
    });
  
    console.log(columnHeaders);
    worksheet.addRow(columnHeaders);
  
    // Llenar la hoja de cálculo con los datos de los objetos
    dataArray.forEach((dataObj) => {
      let objeto = Object.values(dataObj)[2];
      delete objeto._id;
      delete objeto.color;
      delete objeto.isPublic;
      delete objeto.usuario;
      delete objeto.likes;
      delete objeto.imagenes;
      delete objeto.comentarios;
      delete objeto.__v;
      delete objeto.isActivo;
      delete objeto.isLiked;
      delete objeto.imgAlerta;
      delete objeto.isPublicacionPendiente;
      delete objeto.fechaPublicacion;
      delete objeto.updatedAt;
  
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
    let objeto = dataArray[0]._doc;
  
    // Agrega aquí los campos que deseas eliminar
    const camposEliminar = ['_id', 'color', 'isPublic', 'usuario', 'likes', 'imagenes', 'comentarios', '__v', 'isActivo', 'isLiked', 'imgAlerta', 'isPublicacionPendiente', 'fechaPublicacion', 'updatedAt'];
  
    camposEliminar.forEach(campos => {
      delete objeto[campos];
    });
  
    // Cambiar encabezado de createdAt por FechaCreacion
    objeto.FechaCreacion = objeto.createdAt;
    delete objeto.createdAt;
  
    // Cambiar los encabezados de las columnas a español y mayúsculas
    const headerTranslations = {
      titulo: "Tipo emergencia comunitaria",
      contenido: "Descripción de la emergencia",
      color: "Color",
      ciudad: "Ciudad",
      barrio: "Barrio",
      isPublic: "Es Público",
      usuario: "Usuario",
      nombreUsuario: "Nombre de Usuario",
      likes: "Likes",
      imagenes: "Imágenes",
      latitud: "Latitud",
      longitud: "Longitud",
      comentarios: "Comentarios",
      imgAlerta: "Imagen de Alerta",
      isLiked: "Es Favorito",
      isActivo: "Es Activo",
      FechaCreacion: "Fecha de publicación",
      isPublicacionPendiente: "Publicación Pendiente",
    };
  
    const columnHeaders = Object.keys(objeto).map(header => {
      if (headerTranslations.hasOwnProperty(header)) {
        return headerTranslations[header];
      } else {
        return header.charAt(0).toUpperCase() + header.slice(1);
      }
    });
  
    worksheet.addRow(columnHeaders);
  
    // Llenar la hoja de cálculo con los datos de los objetos
    dataArray.forEach((dataObj) => {
      let objeto = Object.values(dataObj)[2];
  
      camposEliminar.forEach(campos => {
        delete objeto[campos];
      });
  
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
}
  