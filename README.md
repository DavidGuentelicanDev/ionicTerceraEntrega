Tercera entrega del curso Programación de Aplicaciones Móviles, DUOC UC 2024.

Esta aplicación está diseñada para poder marcar asistencia a las clases a través de lectura de código QR. Fue construida con Ionic 8 y Angular 18, y se generó únicamente la plataforma Android. En este caso la aplicación sólo está disponible para Android 10 o superior.

La aplicación consta de:

- Módulo de registro de usuario.

- Módulo de login.

- Pantalla principal que permite mostrar datos del usuario logueado y las asignaturas que tiene cargadas.

- Módulo de actualización de datos (contraseña y carrera).

- Pantalla de sedes donde se muestran todas las sedes con información de cada una.

- Módulo de marcación de asistencia a través de lectura de qr con la cámara del equipo.


Cada uno de los módulos y funcionalidades fueron construidos de la siguiente manera:

- El Login, Registro de usuario, Actiualización de datos de usuario, información sobre sedes e información de asignaturas y marcación de asistencia fueron integrados a través de una API creada para ese propósito.

- Para mantener la sesión abierta se integró SQLite como base de datos local para guardar los datos entregados por la API al momento de loguearse. Si se cierra sesión, los datos se borran. La validación para mantener la sesión abierta es si existen datos o no en la DB local.

- Para leer códigos QR se integró el BarcodeScanner del MLKit de Google.


Los comandos necesarios para que la aplicación funcione son:

- Para crear la app: ionic start nombre-de-la-app blank --type=angular

- Para instalar SQLite: a) npm install cordova-sqlite-storage // b) npm install @awesome-cordova-plugins/sqlite

- Para instalar el MLKit de Google: npm install @capacitor-mlkit/barcode-scanning

- Para nativizar la app en Android: a) ionic cap sync // b) npm install @capacitor/android // c) npx cap add android

- Para personalizar splash e ícono de la app: a) npm install @capacitor/splash-screen // b) npm install @capacitor/assets // c) npx capacitor-assets generate (IMPORTANTE: Para realizar este paso, primero es necesario seguir los pasos indicados en https://capacitorjs.com/docs/apis/splash-screen y en https://capacitorjs.com/docs/guides/splash-screens-and-icons)
