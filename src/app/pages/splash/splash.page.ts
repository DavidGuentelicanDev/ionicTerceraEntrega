import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  /* CONSTRUCTOR ------------------------------------------------------------------------------------ */

  //inyectar dependencias
  constructor(private router: Router, private db: DbService) { }


  /* ngOnInit -------------------------------------------------------------------------------------- */

  async ngOnInit() {
    //para la base de datos local
    await this.db.abrirDB();
    await this.db.crearTablaUsuarioLogueado();
    await this.db.crearTablaLike();

    let extras: NavigationExtras = {
      replaceUrl: true
    }

    //para validar que el usuario este logueado
    let usuario = await this.db.obtenerUsuarioLogueado();

    if (usuario) { //si hay usuario logueado, navega al principal
      console.log('DGZ: HAY UN USUARIO LOGUEADO');
      setTimeout(() => {
        this.router.navigate(['principal'], extras);
      }, 1000);
    } else { //si no hay usuario logueado, navega al login
      console.log('DGZ: NO HAY USUARIO');
      setTimeout(() => {
        this.router.navigate(['login'], extras);
      }, 1000);
    }
  }

}
