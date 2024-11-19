import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.page.html',
  styleUrls: ['./registro-usuario.page.scss'],
})
export class RegistroUsuarioPage implements OnInit {

  /* VARIABLES ------------------------------------------------------------------------------------ */

  //modelos para crear usuario
  mdl_correo: string = '';
  mdl_contrasena: string = '';
  mdl_nombre: string = '';
  mdl_apellido: string = '';
  mdl_carrera: string = '';
  mdl_confirmarContrasena: string = '';
  //spinner boton
  spinnerVisible: boolean = false;
  //boton de registro deshabilitado
  botonDeshabilitado: boolean = false;


  /* CONSTRUCTOR ------------------------------------------------------------------------------------ */

  //inyectar dependencias
  constructor(
    private router: Router,
    private api: ApiService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }


  /* ngOnInit --------------------------------------------------------------------------------------- */

  ngOnInit() {
  }


  /* TOAST Y LOADING ------------------------------------------------------------------------------- */

  //toast
  async mostrarToast(mensaje: string, color: string, duracion: number) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      color: color,
      duration: duracion,
      position: 'bottom',
      mode: 'md', //diseño de material design
      cssClass: 'toast' //clase del global.scss
    });

    await toast.present();
  }

  //loading
  async mostrarLoading(mensaje: string, duracion: number) {
    const loading = await this.loadingCtrl.create({
      message: mensaje,
      duration: duracion,
      spinner: 'circles',
      mode: 'md'
    });

    await loading.present();
  }


  /* REGISTRO DE USUARIO --------------------------------------------------------------------------- */

  async registroUsuario() {
    this.spinnerVisible = true;
    this.botonDeshabilitado = true;

    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //constante para validar formato de correo

    setTimeout(async () => {
      if (this.mdl_confirmarContrasena == '') { //valida que el usuario ingrese la confirmacion de contraseña, envia mensaje plano
        this.mostrarToast('Todos los campos son obligatorios', 'warning', 3000);
        this.mdl_contrasena = '';
        this.botonDeshabilitado = false;
        this.spinnerVisible = false;
      } else if (!correoRegex.test(this.mdl_correo)) { //valida que correo tenga formato correo, mensaje plano
        this.mostrarToast('Debes ingresar un formato válido de correo electrónico', 'warning', 3000);
        this.mdl_correo = '';
        this.mdl_contrasena = '';
        this.mdl_confirmarContrasena = '';
        this.botonDeshabilitado = false;
        this.spinnerVisible = false;
      } else if (!this.mdl_correo.endsWith('duocuc.cl')) { //valida que el correo tenga dominio @duocuc.cl, mensaje plano
        this.mostrarToast('Debes ingresar un correo válido de DUOC UC', 'warning', 3000);
        this.mdl_correo = '';
        this.mdl_contrasena = '';
        this.mdl_confirmarContrasena = '';
        this.botonDeshabilitado = false;
        this.spinnerVisible = false;
      } else if (this.mdl_contrasena.length < 3) { //validar que contraseña tenga un largo minimo de n, mensaje plano
        this.mostrarToast('La contraseña debe tener una extensión mínima de 3 caracteres', 'warning', 3000);
        this.mdl_contrasena = '';
        this.mdl_confirmarContrasena = '';
        this.botonDeshabilitado = false;
        this.spinnerVisible = false;
      } else if (this.mdl_contrasena != this.mdl_confirmarContrasena) { //valida que contraseña y confirmar contraseña sean distintas, envia mensaje plano
        this.mostrarToast('Las contraseñas no coinciden', 'warning', 3000);
        this.mdl_contrasena = '';
        this.mdl_confirmarContrasena = '';
        this.botonDeshabilitado = false;
        this.spinnerVisible = false;
      } else if (this.mdl_contrasena == this.mdl_confirmarContrasena) { //contraseña y confirmar contraseña son iguales
        //extras
        let extras: NavigationExtras = {
          replaceUrl: true
        }

        let datos = this.api.crearUsuario(
          this.mdl_correo,
          this.mdl_contrasena,
          this.mdl_nombre,
          this.mdl_apellido,
          this.mdl_carrera
        );
        let respuesta = await lastValueFrom(datos);
        let json_texto = JSON.stringify(respuesta);
        let json = JSON.parse(json_texto);
        console.log('DGZ: ' + json.status + json.message);

        if (json.status == 'error') { //errores de la api
          this.mostrarToast(json.message, 'warning', 3000); //mensaje parametrizado en la respuesta de la api
          this.mdl_correo = '';
          this.mdl_contrasena = '';
          this.mdl_confirmarContrasena = '';
          this.botonDeshabilitado = false;
        } else if (json.status == 'success') { //validacion correcta
          this.mostrarToast(json.message, 'success', 1500); //mensaje parametrizado en la respuesta de la api
          this.mostrarLoading('Volviendo al Inicio de Sesión', 2000); //mostrar loading

          setTimeout(() => {
            this.router.navigate(['login'], extras);
          }, 2000);
        }
      }

      this.spinnerVisible = false;
    }, 1000);
  }

}
