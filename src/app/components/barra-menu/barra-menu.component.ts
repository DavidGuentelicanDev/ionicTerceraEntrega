import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-barra-menu',
  templateUrl: './barra-menu.component.html',
  styleUrls: ['./barra-menu.component.scss'],
})
export class BarraMenuComponent  implements OnInit {

  //variables dinamicas del componente
  @Input() titulo: string = '';
  //variable para controlar la visibilidad de los botones segun la pantalla donde este
  rutaActual: string = '';

  //inyectar dependencias
  constructor(private menuCtrl: MenuController, private router: Router) { }

  ngOnInit() {
    //detecta la ruta al cargar el componente
    this.router.events.subscribe(() => {
      this.rutaActual = this.router.url;
    });
  }

  //abrir el menu lateral
  abrirMenu() {
    this.menuCtrl.open('menu-end');
  }

  //navegar al principal
  principal() {
    let extras: NavigationExtras = {
      replaceUrl: true
    }

    this.router.navigate(['principal'], extras);
  }

  //navegar a actualizacion de datos
  actualizacionDatos() {
    let extras: NavigationExtras = {
      replaceUrl: true
    }

    this.router.navigate(['actualizacion-datos'], extras);
  }

  //navegar a sedes
  sedes() {
    let extras: NavigationExtras = {
      replaceUrl: true
    }

    this.router.navigate(['sedes'], extras);
  }

  //navegar a asistencia
  asistencia() {
    let extras: NavigationExtras = {
      replaceUrl: true
    }

    this.router.navigate(['asistencia'], extras);
  }

  //metodo para verificar si la ruta actual es la misma
  esLaRutaActual(ruta: string): boolean {
    return this.rutaActual.includes(ruta);
  }

  logout() {
    let extras: NavigationExtras = {
      replaceUrl: true
    }

    this.router.navigate(['login'], extras);
  }

}
