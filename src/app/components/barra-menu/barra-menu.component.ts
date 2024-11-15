import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, MenuController, ToastController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-barra-menu',
  templateUrl: './barra-menu.component.html',
  styleUrls: ['./barra-menu.component.scss'],
})
export class BarraMenuComponent  implements OnInit {

  /* VARIABLES -----------------------------------------------------------------------------------*/

  //variables dinamicas del componente
  @Input() titulo: string = '';
  //variable para controlar la visibilidad de los botones segun la pantalla donde este
  rutaActual: string = '';
  //spinner de recarga
  spinnerRecarga: boolean = false;
  //para obtener el correo logueado
  correoLogueado: string = '';


  /* CONSTRUCTOR -----------------------------------------------------------------------------------*/

  //inyectar dependencias
  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private db: DbService
  ) { }


  /* ngONInit -----------------------------------------------------------------------------------*/

  async ngOnInit() {
    //detecta la ruta al cargar el componente
    this.router.events.subscribe(() => {
      this.rutaActual = this.router.url;
    });

    await this.obtenerCorreoLogueado(); //obtener el correo registrado en la base de datos al iniciar cualquier pantalla con este componente
  }


  /* TOAST -----------------------------------------------------------------------------------*/

  async mostrarToast(mensaje: string, color: string, duracion: number) {
    let toast = await this.toastCtrl.create({
      message: mensaje,
      color: color,
      duration: duracion,
      position: 'bottom',
      mode: 'md', //diseño de material design
      cssClass: 'toast' //clase del global.scss
    });
    toast.present();
  }


  /* MENU LATERAL -----------------------------------------------------------------------------------*/

  //abrir el menu lateral
  abrirMenu() {
    this.menuCtrl.open('menu-end');
  }

  //navegar al principal
  principal() {
    let extras: NavigationExtras = {
      replaceUrl: true
    }

    setTimeout(() => {
      this.router.navigate(['principal'], extras);
    }, 250);
  }

  //navegar a actualizacion de datos
  actualizacionDatos() {
    let extras: NavigationExtras = {
      replaceUrl: true
    }

    setTimeout(() => {
      this.router.navigate(['actualizacion-datos'], extras);
    }, 250);
  }

  //navegar a sedes
  sedes() {
    let extras: NavigationExtras = {
      replaceUrl: true
    }

    setTimeout(() => {
      this.router.navigate(['sedes'], extras);
    }, 250);
  }

  //navegar a asistencia
  asistencia() {
    let extras: NavigationExtras = {
      replaceUrl: true
    }

    setTimeout(() => {
      this.router.navigate(['asistencia'], extras);
    }, 250);
  }

  //metodo para verificar si la ruta actual es la misma
  esLaRutaActual(ruta: string): boolean {
    return this.rutaActual.includes(ruta);
  }


  /* RESCATAR CORREO ------------------------------------------------------------------------------- */

  async obtenerCorreoLogueado() {
    let usuario = await this.db.obtenerUsuarioLogueado();

    if (usuario) {
      this.correoLogueado = usuario.correo;
      console.log('DGZ: CORREO LOGUEADO ' + this.correoLogueado);
    }
  }


  /* CERRAR SESION -----------------------------------------------------------------------------------*/

  //metodo del logout
  async logout() {
    this.spinnerRecarga = true;

    //primero borrar el usuario logueado
    await this.eliminarUsuarioLogueado(this.correoLogueado);

    let extras: NavigationExtras = {
      replaceUrl: true
    }

    this.mostrarToast('Cerrando sesión', 'tertiary', 1500);

    setTimeout(() => {
      this.spinnerRecarga = false;
      this.router.navigate(['login'], extras);
    }, 2000);
  }

  //funcion para abrir el mensaje de cerrar sesion
  async cerrarSesion() {
    let alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('DGZ: Cierre de sesión cancelado');
          }
        },
        {
          text: 'Cerrar',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  //funcion para borrar usuario logueado
  async eliminarUsuarioLogueado(correo: string) {
    await this.db.eliminarUsuarioLogueado(correo);
  }

}
