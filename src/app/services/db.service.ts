import { Injectable } from '@angular/core';
//importacion para sqlite
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

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

}
