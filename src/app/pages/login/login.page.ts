import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  /* VARIABLES ----------------------------------------------------------------------------------- */

  //modelos del login
  mdl_correo: string = '';
  mdl_contrasena: string = '';
  //spinner boton
  spinnerVisible: boolean = false;
  //boton de inicio deshabilitado
  botonDeshabilitado: boolean = false;
  //spinner de recarga
  spinnerRecarga: boolean = false;
  //variables para guardar usuario
  db_correo: string = '';
  db_nombre: string = '';
  db_apellido: string = '';
  db_carrera: string = '';
  //contraseña visible
  verContrasena: boolean = false;


  /* CONSTRUCTOR ------------------------------------------------------------------------------------- */

  //inyectar dependencias
  constructor(
    private router: Router,
    private api: ApiService,
    private toastCtrl: ToastController,
    private db: DbService
  ) { }


  /* ngOnInit ---------------------------------------------------------------------------------------- */

  ngOnInit() {
  }


  /* TOAST ----------------------------------------------------------------------------------------- */

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


  /* NAVEGAR AL REGISTRO --------------------------------------------------------------------------- */

  navegarRegistroUsuario() {
    setTimeout(() => {
      this.router.navigate(['registro-usuario']);
    }, 250);
    this.mdl_correo = '';
    this.mdl_contrasena = '';
    this.verContrasena = false;
  }


  /* LOGIN ---------------------------------------------------------------------------------------- */

  async login() {
    this.spinnerVisible = true;
    this.botonDeshabilitado = true;

    let datos = this.api.login(this.mdl_correo, this.mdl_contrasena);
    let respuesta = await lastValueFrom(datos);
    let json_texto = JSON.stringify(respuesta);
    let json = JSON.parse(json_texto);
    console.log('DGZ: ' + json.status);

    setTimeout(async () => {
      if (json.status == 'error') {
        console.log('DGZ: ' + json.message);
        this.mostrarToast(json.message, 'warning', 3000); //mensaje parametrizado en la api
        this.mdl_correo = '';
        this.mdl_contrasena = '';
        this.verContrasena = false;
        this.botonDeshabilitado = false;
      } else if (json.status == 'success') { //respuesta correcta
        console.log('DGZ: ' + json.usuario.correo + ' ' + json.usuario.nombre + ' ' + json.usuario.apellido + ' ' + json.usuario.carrera);
        //guardando usuario que se loguea
        this.db_correo = json.usuario.correo;
        this.db_nombre = json.usuario.nombre;
        this.db_apellido = json.usuario.apellido;
        this.db_carrera = json.usuario.carrera;
        await this.guardarUsuarioLogueado(); //guardando usuario

        //extras
        let extras: NavigationExtras = {
          replaceUrl: true
        }

        this.mostrarToast('Bienvenid@ ' + this.db_nombre + ' ' + this.db_apellido , 'success', 3000);
        this.spinnerRecarga = true; //carga un spinner que ocupa toda la pantalla mientras navega al principal

        setTimeout(() => {
          this.router.navigate(['principal'], extras);
          this.spinnerRecarga = false;
        }, 2000);
      }

      this.spinnerVisible = false;
    }, 1000);
  }

  //funcion para guardar el usuario logueado
  async guardarUsuarioLogueado() {
    await this.db.guardarUsuarioLogueado(
      this.db_correo,
      this.db_nombre,
      this.db_apellido,
      this.db_carrera
    );
  }


  /* OJO CONTRASEÑA ------------------------------------------------------------------------------- */

  contrasenaVisible() {
    this.verContrasena = !this.verContrasena; //alterna la visibilidad de la contraseña
  }

}
