Comandos usados para crear la App

1. Crear app: ionic start nombre-de-la-aplicacion blank --type=angular

2. Crear páginas:

  ionic g page pages/splash

  ionic g page pages/login

  ionic g page pages/registro-usuario

  ionic g page pages/principal

  ionic g page pages/actualizacion-datos

  ionic g page pages/sedes

  ionic g page pages/asistencia

3. Crear servicios:

  ionic g service services/api

  ionic g service services/db

4. Crear componentes:

  ionic g module components

  ionic g component components/barra-menu

5. Instalar SQLite:

  npm install cordova-sqlite-storage

  npm install @awesome-cordova-plugins/sqlite

6. Instalar mlkit: npm install @capacitor-mlkit/barcode-scanning

7. Nativizar en Android:

  ionic cap sync

  npm install @capacitor/android

  npx cap add android
