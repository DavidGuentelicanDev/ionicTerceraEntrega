import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

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
  //spinner de recarga
  spinnerRecarga: boolean = false;


  /* CONSTRUCTOR --------------------------------------------------------------------------------- */

  //inyectar dependencias
  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private db: DbService
  ) { }


  /* ngOnInit --------------------------------------------------------------------------------- */

  async ngOnInit() {
    //extras para reiniciar luego de cambiar contraseña
    let extras = this.router.getCurrentNavigation()?.extras;

    if (extras?.state) {
      this.reiniciar();
    }

    //para los skeletons
    this.skeletonsCargando = true;

    await this.mostrarUsuarioLogueado(); //mostrar usuario logueado guardado en db

    setTimeout(async () => {
      this.skeletonsCargando = false;
    }, 1000); //mantener skeletons n seg.
  }


  /* TOAST ------------------------------------------------------------------------------------------ */

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


  /* OBTENER USUARIO LOGUEADO ----------------------------------------------------------------------- */

  async mostrarUsuarioLogueado() {
    let usuario = await this.db.obtenerUsuarioLogueado();
    
    if (usuario) {
      this.correo = usuario.correo;
      this.nombre = usuario.nombre;
      this.apellido = usuario.apellido;
      this.carrera = usuario.carrera;
      console.log('DGZ: usuario en la db ' + this.correo + ' ' + this.nombre + ' ' + this.apellido + ' ' + this.carrera);
    }
  }


  /* REINICIAR LUEGO DE ACTUALIZAR DATOS ------------------------------------------------------------- */

  //metodo del logout
  async logout() {
    this.spinnerRecarga = true;

    //primero borrar el usuario logueado
    await this.eliminarUsuarioLogueado(this.correo);

    let extras: NavigationExtras = {
      replaceUrl: true
    }

    this.mostrarToast('Cerrando sesión', 'tertiary', 1500);

    setTimeout(() => {
      this.spinnerRecarga = false;
      this.router.navigate(['login'], extras);
    }, 2000);
  }

  //funcion para reiniciar cuando se cambie contraseña
  async reiniciar() {
    let alert = await this.alertCtrl.create({
      header: 'Reiniciar aplicación',
      message: 'Para aplicar el cambio de contraseña, es necesario reiniciar la aplicación',
      backdropDismiss: false, //evita que el alert se cierre al presionar fuera
      buttons: [
        {
          text: 'Cerrar sesión',
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
