module.exports = (data) => {
  const today = new Date();
  const groupedData = {};

  // Agrupar los datos por título
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
           <meta charset="utf-8">
           <title>PDF Result Template</title>
           <style>
             
          .cont-aling {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
    
          .text-title {
            font-size: 1.1rem;
            color: var(--mainBlue);
            font-family: "Roboto", sans-serif;
            white-space: nowrap; /* Agrega esta propiedad */
          }
             .invoice-box {
             max-width: 800px;
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
             .invoice-box table tr td:nth-child(2) {
             text-align: right;
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
           <div class="invoice-box">
              <table cellpadding="0" cellspacing="0">
                 <tr class="top">
                    <td colspan="2">
                       <!-- Encabezado aquí -->
                    </td>
                 </tr>
                 <tr class="heading">
                   <td>Título</td>
                   <td>Hora de inicio</td>
                   <td>Hora fin</td>
                   <td>Total</td>
                 </tr>
                 ${Object.entries(groupedData)
                   .map(
                     ([titulo, items]) => `
                       <tr class="item">
                         <td>${titulo}</td>
                         <td>${items[0].createdAt.toLocaleTimeString()}</td>
                         <td>${items[
                           items.length - 1
                         ].updatedAt.toLocaleTimeString()}</td>
                         <td>${items.length}</td>
                       </tr>
                     `
                   )
                   .join("")}
              </table>
           </div>
        </body>
     </html>
     `;
};
