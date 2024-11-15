import { Injectable } from '@angular/core';

//importar para activar este servicio de APIs
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  /* URLS Y VARIABLES ------------------------------------------------------------------------------ */

  //url general
  URL_DUOC: string = 'https://www.s2-studio.cl';
  //correo logueado para asignaturas y asistencia
  correoUsuario: string = '';


  /* CONSTRUCTOR ------------------------------------------------------------------------------------ */

  constructor(private http: HttpClient) { }


  /* API DUOC 1: LOGIN / REGISTRO / SEDES Y ACTUALIZAR USUARIO -------------------------------------- */

  //funcion de creacion de usuario
  crearUsuario(correo: string, contrasena: string, nombre: string, apellido: string, carrera: string) {
    let usuario: any = {};

    try {
      usuario.correo = correo;
      usuario.contrasena = contrasena;
      usuario.nombre = nombre;
      usuario.apellido = apellido;
      usuario.carrera = carrera;
    } catch (e) {
      console.log('DGZ: ' + JSON.stringify(e));
    }

    return this.http.post(this.URL_DUOC + '/api_duoc/usuario/usuario_almacenar', usuario).pipe();
  }

  //funcion para loguearse
  login(correo: string, contrasena: string) {
    let usuario: any = {};

    try {
      usuario.correo = correo;
      usuario.contrasena = contrasena;
    } catch (e) {
      console.log('DGZ: ' + JSON.stringify(e));
    }

    return this.http.post(this.URL_DUOC + '/api_duoc/usuario/usuario_login', usuario).pipe();
  }

  //mostrar sedes
  mostrarSedes() {
    return this.http.get(this.URL_DUOC + '/api_duoc/usuario/sedes_obtener').pipe();
  }

  //actualizar contraseña y carrera
  actualizarUsuario(correo: string, contrasena: string, carrera: string) {
    let usuario: any = {};

    try {
      usuario.correo = correo;
      usuario.contrasena = contrasena;
      usuario.carrera = carrera;
    } catch (e) {
      console.log('DGZ: ' + JSON.stringify(e));
    }

    return this.http.patch(this.URL_DUOC + '/api_duoc/usuario/usuario_modificar', usuario).pipe();
  }


  /* API DUOC 2: ASIGNATURAS Y ASISTENCIA ----------------------------------------------------------- */

  //obtener datos de asignaturas y asistencia
  obtenerAsignaturasYAsistencia() {
    return this.http.get(this.URL_DUOC + '/api_duoc/usuario/asistencia_obtener?correo=' + this.correoUsuario).pipe();
  }

  //marcar asistencia
  marcarAsistencia(sigla: string, correo: string, fecha: string) {
    let asistencia: any = {};

    try {
      asistencia.sigla = sigla;
      asistencia.correo = correo;
      asistencia.fecha = fecha;
    } catch (e) {
      console.log('DGZ: ' + JSON.stringify(e));
    }

    return this.http.post(this.URL_DUOC + '/api_duoc/usuario/marcar_asistencia', asistencia).pipe();
  }

}
