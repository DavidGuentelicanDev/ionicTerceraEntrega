import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  /* VARIABLES --------------------------------------------------------------------------------- */

  //skeletons
  skeletonsCargando: boolean = true;
  //variables para mostrar usuario
  correo: string = '';
  nombre: string = '';
  apellido: string = '';
  carrera: string = '';


  /* CONSTRUCTOR --------------------------------------------------------------------------------- */

  constructor() { }


  /* ngOnInit --------------------------------------------------------------------------------- */

  ngOnInit() {
    //PARA LOS SKELETONS
    this.skeletonsCargando = true;

    // await this.mostrarUsuarioLogueado(); //mostrar usuario logueado guardado en db

    setTimeout(async () => {
      this.skeletonsCargando = false;
    }, 2000); //mantener skeletons n seg.
  }

}
