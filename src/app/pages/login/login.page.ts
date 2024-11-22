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
  //variables para guardar usuario
  db_correo: string = '';
  db_nombre: string = '';
  db_apellido: string = '';
  db_carrera: string = '';
  //barra de progreso para simular una carga
  barraProgresoVisible: boolean = false;


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
      cssClass: 'toast' //clase del global.scss
    });

    await toast.present();
  }


  /* NAVEGAR AL REGISTRO --------------------------------------------------------------------------- */

  navegarRegistroUsuario() {
    setTimeout(() => {
      this.router.navigate(['registro-usuario']);
    }, 250);
    this.mdl_correo = '';
    this.mdl_contrasena = '';
  }


  /* LOGIN ---------------------------------------------------------------------------------------- */

  //logueo
  async login() {
    this.spinnerVisible = true;
    this.botonDeshabilitado = true;

    let datos = this.api.login(this.mdl_correo, this.mdl_contrasena);
    let respuesta = await lastValueFrom(datos);
    let json_texto = JSON.stringify(respuesta);
    let json = JSON.parse(json_texto);
    console.log('DGZ status: ' + json.status);

    setTimeout(async () => {
      if (json.status == 'error' && json.message == 'Todos los campos son obligatorios') {
        await this.mostrarToast(json.message, 'warning', 3000); //mensaje parametrizado en la api
        this.botonDeshabilitado = false;
        console.log('DGZ: ' + json.message);
      } else if (json.status == 'error' && json.message == 'Credenciales Inválidas') {
        await this.mostrarToast(json.message, 'danger', 3000);
        this.mdl_correo = '';
        this.mdl_contrasena = '';
        this.botonDeshabilitado = false;
        console.log('DGZ: ' + json.message);
      } else if (json.status == 'success') { //respuesta correcta
        //guardando usuario que se loguea
        this.barraProgresoVisible = true; //se inicia el ion-progress-bar solo al ser login correcto
        this.db_correo = json.usuario.correo;
        this.db_nombre = json.usuario.nombre;
        this.db_apellido = json.usuario.apellido;
        this.db_carrera = json.usuario.carrera;
        console.log('DGZ: ' + this.db_correo + ' ' + this.db_nombre + ' ' + this.db_apellido + ' ' + this.db_carrera);
        await this.guardarUsuarioLogueado(); //guardando usuario

        let extras: NavigationExtras = {
          replaceUrl: true
        }

        await this.mostrarToast('Bienvenid@ ' + this.db_nombre + ' ' + this.db_apellido , 'success', 3000);

        setTimeout(() => {
          this.barraProgresoVisible = false;
          this.router.navigate(['principal'], extras);
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

}
