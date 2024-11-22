import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx'; //importacion para sqlite

@Injectable({
  providedIn: 'root'
})
export class DbService {

  /* VARIABLES --------------------------------------------------------------------------------- */

  //definir una instancia de la db para poder inicializarla en nulo
  dbInstancia: SQLiteObject | null = null;


  /* CONSTRUCTOR ------------------------------------------------------------------------------- */

  //inyectar dependencias
  constructor(private sqlite: SQLite) { }


  /* METODOS DE LA DB LOCAL PARA USUARIO Y MANTENER SESION ---------------------------------------- */

  //abrir la instancia de db
  async abrirDB() {
    try {
      this.dbInstancia = await this.sqlite.create({
        name: 'datos.db',
        location: 'default'
      });
      console.log('DGZ: BASE DE DATOS OK');
    } catch (e) {
      console.log('DGZ - PROBLEMA AL INICIAR LA BASE DE DATOS: ' + JSON.stringify(e));
    }
  }

  //crear tabla usuario logueado
  async crearTablaUsuarioLogueado() {
    await this.abrirDB();

    try {
      await this.dbInstancia?.executeSql('CREATE TABLE IF NOT EXISTS USUARIO_LOGUEADO (CORREO VARCHAR(30), NOMBRE VARCHAR(30), APELLIDO VARCHAR(30), CARRERA VARCHAR(50))', []);
      console.log('DGZ: TABLA USUARIO_LOGUEADO OK');
    } catch (e) {
      console.log('DGZ: ' + JSON.stringify(e));
    }
  }

  //guardar el usuario que se loguee en la db
  async guardarUsuarioLogueado(correo: string, nombre: string, apellido: string, carrera: string) {
    await this.abrirDB();

    //insertar datos
    try {
      await this.dbInstancia?.executeSql('INSERT INTO USUARIO_LOGUEADO VALUES(?, ?, ?, ?)', [correo, nombre, apellido, carrera]);
      console.log('DGZ: USUARIO LOGUEADO [correo: ' + correo + ', nombre: ' + nombre + ', apellido: ' + apellido + ', carrera: ' + carrera + '] GUARDADO OK');
    } catch (e) {
      console.log('DGZ: ' + JSON.stringify(e));
    }
  }

  //obtener usuario logueado
  async obtenerUsuarioLogueado() {
    await this.abrirDB();

    try {
      let data = await this.dbInstancia?.executeSql('SELECT CORREO, NOMBRE, APELLIDO, CARRERA FROM USUARIO_LOGUEADO', []);

      if (data?.rows.length > 0) {
        return {
          correo: data.rows.item(0).CORREO,
          nombre: data.rows.item(0).NOMBRE,
          apellido: data.rows.item(0).APELLIDO,
          carrera: data.rows.item(0).CARRERA
        };
      }
      return null;
    } catch (e) {
      console.log('DGZ: ' + JSON.stringify(e));
      return null;
    }
  }

  //eliminar usuario logueado
  async eliminarUsuarioLogueado() {
    await this.abrirDB();

    try {
      await this.dbInstancia?.executeSql('DELETE FROM USUARIO_LOGUEADO', []);
      console.log('DGZ: USUARIO BORRADO DE LA DB OK');
    } catch (e) {
      console.log('DGZ: ' + JSON.stringify(e));
    }
  }


  /* METODOS DE LA DB LOCAL PARA LIKES DE SEDES ------------------------------------------------------ */

  //crear tabla like
  async crearTablaLike() {
    await this.abrirDB();

    try {
      await this.dbInstancia?.executeSql('CREATE TABLE IF NOT EXISTS MEGUSTA (USUARIO VARCHAR(30), SEDE VARCHAR(50))', []);
      console.log('DGZ: TABLA MEGUSTA OK');
    } catch (e) {
      console.log('DGZ: ' + JSON.stringify(e));
    }
  }

  //guardar like
  async guardarLike(usuario: string, sede: string) {
    await this.abrirDB();

    try {
      await this.dbInstancia?.executeSql('INSERT INTO MEGUSTA VALUES (?, ?)', [usuario, sede]);
      console.log('DGZ: ME GUSTA GUARDADO ' + usuario + ' ' + sede);
    } catch (e) {
      console.log('DGZ: ' + JSON.stringify(e));
    }
  }

  //eliminar like
  async eliminarLike(usuario: string, sede: string) {
    await this.abrirDB();

    try {
      await this.dbInstancia?.executeSql('DELETE FROM MEGUSTA WHERE USUARIO = ? AND SEDE = ?', [usuario, sede]);
      console.log('DGZ: ME GUSTA DEL USUARIO ' + usuario + ' Y SEDE ' + sede + ' BORRADO OK');
    } catch (e) {
      console.log('DGZ: ' + JSON.stringify(e));
    }
  }

  //select a los likes
  async existeLike(usuario: string, sede: string): Promise<boolean> {
    await this.abrirDB();

    try {
      let resultado = await this.dbInstancia?.executeSql('SELECT USUARIO, SEDE FROM MEGUSTA WHERE USUARIO = ? AND SEDE = ?', [usuario, sede]);
      return resultado?.rows.length > 0;
    } catch (e) {
      console.log('DGZ: ' + JSON.stringify(e));
      return false;
    }
  }

  //contar megusta por sede
  async contarLikePorSede(sede: string): Promise<number> {
    await this.abrirDB();

    try {
      let resultado = await this.dbInstancia?.executeSql('SELECT COUNT(SEDE) AS total FROM MEGUSTA WHERE SEDE = ?', [sede]);

      //si hay filas con el nombre de la sede
      if (resultado?.rows.length > 0) {
        //entonces cuenta la cantidad de filas
        let contador = resultado.rows.item(0).total;
        console.log('DGZ: TOTAL ME GUSTA PARA SEDE ' + sede + ' ES ' + contador);
        return contador; //me devuelve el total
      }
      return 0;
    } catch (e) {
      console.log('DGZ: ' + JSON.stringify(e));
      return 0;
    }
  }

}
