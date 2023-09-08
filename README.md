# Backend de Seguridad ESPE
El proyecto Backend de Seguridad ESPE es una parte fundamental del proyecto de vinculación con la sociedad denominado "Implementación de aplicaciones web y móvil para gestionar emergencias comunitarias en la provincia de Santo Domingo de los Tsáchilas". Su objetivo principal es fortalecer la seguridad de la comunidad a través de la comunicación, coordinación y respuesta ante situaciones de emergencia. Esta aplicación aprovecha el alto uso de dispositivos móviles e Internet para ofrecer una solución innovadora en el campo de la protección ciudadana.

## Pasos para ejecutar el proyecto
A continuación, se detallan los pasos necesarios para ejecutar el proyecto Backend de Seguridad ESPE en su entorno local:

### Requisitos previos
Asegúrese de tener instalado [Node.js](https://nodejs.org/en) en su sistema.

### Clonar el repositorio
```
git clone https://github.com/Vinici0/rest-server-movil-web.git
cd rest-server-movil-web
```
### Instalar dependencias
Ejecute el siguiente comando para instalar todas las dependencias del proyecto:
```
npm install
```
### Configurar variables de entorno

El proyecto utiliza variables de entorno para configuraciones sensibles. Cree un archivo .env en el directorio raíz del proyecto y configure las siguientes variables:
```
PORT=3000            # Puerto en el que se ejecutará el servidor
DB_CNN=              # URI de la base de datos MongoDB
JWT_KEY=             # Clave secreta para JWT
TOKEN_NOTIFICAIONES= # notificaciones
```
### Ejecutar el servidor
El servidor estará disponible en ```http://localhost:3000```.

### Dependencias del proyecto
A continuación, se enumeran las principales dependencias utilizadas en este proyecto: <br>

- **axios:** Realizar solicitudes HTTP.
- **bcryptjs:** Realizar el hash de contraseñas.
- **cors:** Configuración de políticas de acceso de origen cruzado.
- **dotenv:** Cargar variables de entorno desde un archivo.
- **express:** Framework de aplicación web.
- **express-fileupload:** Procesar cargas de archivos.
- **express-validator:** Validación de datos en Express.
- **google-auth-library:** Autenticación con Google.
- **html-pdf:** Generación de archivos PDF a partir de HTML.
- **jsonwebtoken:** Implementación de JSON Web Tokens.
- **lodash:** Utilidades de manipulación de datos.
- **moment:** Manipulación de fechas y horas.
- **mongoose:** Modelado de datos para MongoDB.
- **pdfkit y pdfmake:** Generación de documentos PDF.
- **socket.io:** Comunicación en tiempo real mediante WebSocket.
- **uuid:** Generación de identificadores únicos.

### Contacto
Si tienes alguna pregunta o comentario sobre este proyecto, no dudes en contactarme a través de mi perfil de [LinkedIn](https://www.linkedin.com/in/vinicio-borja/).<br><br>
¡Gracias por su interés en el proyecto Backend de Seguridad ESPE!

