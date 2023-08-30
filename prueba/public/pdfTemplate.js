module.exports = (dataInfo) => {
  console.log(dataInfo);
  const data = dataInfo.publicaciones;

  const today = new Date();
  const groupedData = {};

  data.forEach((item) => {
    if (!groupedData[item.titulo]) {
      groupedData[item.titulo] = [];
    }
    groupedData[item.titulo].push(item);
  });

  return `
     <!doctype html>
     <html>
     <head>
       <meta charset="utf-8" />
       <title>PDF Result Template</title>
       <style>
   
            .cont-info {
             display: table;
             width: 100%;
         }
         .cont-info > div {
             display: table-cell;
             text-align: center;
             vertical-align: middle;
             padding: 10px;
         }
         .cont-info img {
             max-width: 156px;
             width: 100%;
         }
         .text-title {
             font-size: 16px;
             font-weight: bold;
             margin: 5px 0;
         }

         .cont-info2 {
  display: flex;
  justify-content: space-between; /* Distribuye los elementos con espacio entre ellos */
  width: 100%; /* Ocupa todo el ancho disponible */
  max-width: 1000px; /* Ajusta el ancho máximo según tu diseño */
  margin: 0 auto; /* Centra horizontalmente */
}

.column {
  width: 25%; /* Ancho del 25% */
  padding: 10px; /* Margen interno */
  margin: 0 10px; /* Espacio entre los elementos */
  box-sizing: border-box; /* Incluye el padding en el ancho */
  background-color: #f0f0f0; /* Solo para visualizar el área ocupada */
}

   
           .cont-info > div {
             width: calc(33.33% - 20px); /* Ancho de cada elemento */
             margin: 0 10px; /* Espacio entre los elementos */
           }
   
           .text-title {
             font-size: 1.1rem;
             color: var(--mainBlue);
             font-family: "Roboto", sans-serif;
             white-space: nowrap; /* Agrega esta propiedad */
           }
   
           .flex-container {
            display: flex;
            justify-content: space-between; /* Distribuye los elementos con espacio entre ellos */
            margin: 0 -10px; /* Agrega un margen negativo para compensar el espacio */
          }
          
          .flex-item {
            width: calc(25% - 20px); /* Ancho del 25% y espacio total de margen */
            padding: 10px; /* Margen interno */
            box-sizing: border-box; /* Incluye el padding en el ancho */
            background-color: #f0f0f0; /* Solo para visualizar el área ocupada */
          }
          
   
              .invoice-box {
              max-width: 1500px;
              margin: auto;
              padding: 30px;
              border: 1px solid #eee;
              box-shadow: 0 0 10px rgba(0, 0, 0, .15);
              font-size: 16px;
              line-height: 24px;
              font-family: 'Helvetica Neue', 'Helvetica',
              color: #555;
              }
   
   
              .margin-top {
              margin-top: 50px;
              }
   
              .justify-center {
              text-align: center;
              }
   
              .invoice-box table {
              width: 100%;
              line-height: inherit;
              text-align: left;
              }
   
              .invoice-box table td {
              padding: 5px;
              vertical-align: top;
              }
   
   
   
              .invoice-box table tr.top table td {
              padding-bottom: 20px;
              }
   
              .invoice-box table tr.top table td.title {
              font-size: 45px;
              line-height: 45px;
              color: #333;
              }
   
              .invoice-box table tr.information table td {
              padding-bottom: 40px;
              }
   
              .invoice-box table tr.heading td {
              background: #eee;
              border-bottom: 1px solid #ddd;
              font-weight: bold;
              }
   
              .invoice-box table tr.details td {
              padding-bottom: 20px;
              }
   
              .invoice-box table tr.item td {
              border-bottom: 1px solid #eee;
              }
              .cont-info {
               display: flex;
               flex-direction: row;
               justify-content: space-between;
             }
   
   
              .invoice-box table tr.item.last td {
              border-bottom: none;
              }
   
              .invoice-box table tr.total td:nth-child(2) {
              border-top: 2px solid #eee;
              font-weight: bold;
              }
   
              @media only screen and (max-width: 600px) {
              .invoice-box table tr.top table td {
              width: 100%;
              display: block;
              text-align: center;
              }
   
              .invoice-box table tr.information table td {
              width: 100%;
              display: block;
              text-align: center;
              }
              }
       </style>
     </head>
     <body>
       <div class="cont-info">
         <div>
           <img
             src="https://res.cloudinary.com/dmkvix7ds/image/upload/v1691793446/descarga_e32xnn.png"
           />
         </div>
         <div>
           <h1 class="text-title">UNIVERSIDAD DE LAS FUERZAS ARMADAS - ESPE</h1>
           <h1 class="text-title">REPORTE DE EMERGENCIAS COMUNITARIAS</h1>
         </div>
         <div>
           <img
             src="https://res.cloudinary.com/dmkvix7ds/image/upload/v1691793446/logo_gx8oxe.png"
           />
         </div>
       </div>

       <div class="cont-info">
       <div class="column">
         <div class="text-title">Usuario registrado</div>
         <div>${data.totalUsuarios}</div>
       </div>
       <div class="column">
         <div class="text-title">Publicaciones registradas</div>
         <div>${data.length}</div>
       </div>
       <div class="column">
         <div class="text-title">Publicaciones por mes</div>
         <div>${data.totalPublicacionesMes}</div>
       </div>
       <div class="column">
         <div class="text-title">Publicaciones por día</div>
         <div>${data.totalPublicacionesDia}</div>
       </div>
     </div>
     
    
       <div class="invoice-box">
         <table cellpadding="0" cellspacing="0" class="horizontal-table">
           <tr class="top">
             <td colspan="14">
               <!-- Encabezado aquí -->
               <div class="cont-aling">
                 <div class="text-title">Reporte de Emergencias</div>
                 <div>${today.toLocaleDateString()}</div>
               </div>
             </td>
           </tr>
           <tr class="heading">
             <td colspan="2">Título</td>
             <td colspan="2">Ciudad</td>
             <td colspan="2">Fecha de creación</td>
             <td colspan="2">Fecha de actualización</td>
             <td colspan="2">Hora de creación</td>
             <td colspan="2">Hora de actualización</td>
             <td colspan="2">Cantidad</td>
             <td colspan="2">Porcentaje</td>
           </tr>
           ${Object.entries(groupedData)
             .map(
               ([titulo, items]) => `
           <tr class="item">
             <td colspan="2">${titulo}</td>
             <td colspan="2">${items[0].ciudad}</td>
             <td colspan="2">${items[0].createdAt.toLocaleDateString()}</td>
             <td colspan="2">
               ${items[items.length - 1].updatedAt.toLocaleDateString()}
             </td>
             <td colspan="2">${items[0].createdAt.toLocaleTimeString()}</td>
             <td colspan="2">
               ${items[items.length - 1].updatedAt.toLocaleTimeString()}
             </td>
             <td colspan="2">${items.length}</td>
             <td colspan="2">
               ${((items.length / data.length) * 100).toFixed(2)}%
             </td>
           </tr>
           `
             )
             .join("")}
   
           <tr class="total">
             <td colspan="2">Total</td>
             <td colspan="2"></td>
             <td colspan="2"></td>
             <td colspan="2"></td>
             <td colspan="2"></td>
             <td colspan="2"></td>
             <td colspan="2">${data.length}</td>
             <td colspan="2">100%</td>
           </tr>
         </table>
       </div>
     </body>
   </html>
   
     `;
};
