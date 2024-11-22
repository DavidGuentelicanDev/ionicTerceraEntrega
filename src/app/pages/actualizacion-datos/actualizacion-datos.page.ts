import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-actualizacion-datos',
  templateUrl: './actualizacion-datos.page.html',
  styleUrls: ['./actualizacion-datos.page.scss'],
})
export class ActualizacionDatosPage implements OnInit {

  /* VARIABLES --------------------------------------------------------------------------------------- */

  //modelos para el cambio de contraseña
  mdl_correo: string = '';
  mdl_contrasenaNueva: string = '';
  mdl_confirmarContrasenaNueva: string = '';
  mdl_carrera: string = '';
  //correo logueado
  correoLogueado: string = '';
  //spinner boton
  spinnerVisible: boolean = false;
  //boton de registro deshabilitado
  botonDeshabilitado: boolean = false;


  /* CONSTRUCTOR ------------------------------------------------------------------------------------- */

  //inyectar dependencias
  constructor(
    private router: Router,
    private api: ApiService,
    private toastCtrl: ToastController,
    private db: DbService,
    private loadingCtrl: LoadingController
  ) { }


  /* ngOnInit ---------------------------------------------------------------------------------------- */

  async ngOnInit() {
    await this.validarUsuarioLogueado(); //validar que exista usuario al ingresar a la pantalla
  }


  /* TOAST Y LOADING -------------------------------------------------------------------------------- */

  //toast
  async mostrarToast(mensaje: string, color: string, duracion: number) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      color: color,
      duration: duracion,
      cssClass: 'toast' //clase del global.scss
    });

    await toast.present();
  }

  //loading
  async mostrarLoading(mensaje: string, duracion: number) {
    const loading = await this.loadingCtrl.create({
      message: mensaje,
      duration: duracion,
      spinner: 'circles'
    });

    await loading.present();
  }


  /* VALIDAR USUARIO LOGUEADO ----------------------------------------------------------------------- */

  async validarUsuarioLogueado() {
    let usuario = await this.db.obtenerUsuarioLogueado();
    
    if (usuario) {
      this.correoLogueado = usuario.correo;
      console.log('DGZ: usuario en la db ' + this.correoLogueado);
    }
  }


  /* ACTUALIZAR DATOS ------------------------------------------------------------------------------- */

  async actualizarUsuario() {
    this.spinnerVisible = true;
    this.botonDeshabilitado = true;

    setTimeout(async() => {
      if ( //validar adicionalmente el campo confirmar contraseña nueva con mensaje plano
        !this.mdl_correo ||
        !this.mdl_carrera ||
        !this.mdl_contrasenaNueva ||
        !this.mdl_confirmarContrasenaNueva
      ) {
        await this.mostrarToast('Todos los campos son obligatorios', 'warning', 3000);
        this.botonDeshabilitado = false;
        console.log('DGZ: campos vacios');
      } else if (this.mdl_contrasenaNueva.length < 3) { //validar largo de contraseña con min 3 caracteres, mensaje plano
        await this.mostrarToast('La nueva contraseña debe tener un largo mínimo de 3 caracteres', 'warning', 3000);
        this.mdl_contrasenaNueva = '';
        this.mdl_confirmarContrasenaNueva = '';
        this.botonDeshabilitado = false;
        console.log('DGZ: largo nueva contraseña menor a 3');
      } else if (this.mdl_contrasenaNueva != this.mdl_confirmarContrasenaNueva) { //nueva contraseña y confirmar nueva contraseña distintas, mensaje plano
        await this.mostrarToast('Las contraseñas no coinciden', 'warning', 3000);
        this.mdl_contrasenaNueva = '';
        this.mdl_confirmarContrasenaNueva = '';
        this.botonDeshabilitado = false;
        console.log('DGZ: contraseña nueva y confirmar contraseña NO son iguales');
      } else if (this.mdl_contrasenaNueva == this.mdl_confirmarContrasenaNueva) { //nueva contraseña y confirmar nueva contraseña iguales
        console.log('DGZ: contraseña y confirmar contraseña SON iguales');
        if (this.mdl_correo != this.correoLogueado) { //el correo ingresado no corresponde al correo logueado
          await this.mostrarToast('El correo ingresado no corresponde al usuario logueado', 'danger', 3000);
          this.mdl_correo = '';
          this.mdl_contrasenaNueva = '';
          this.mdl_confirmarContrasenaNueva = '';
          this.botonDeshabilitado = false;
          console.log('DGZ: correo ingresado no es igual al correo logueado');
        } else if (this.mdl_correo == this.correoLogueado) {
          //enviar datos a la api
          let datos = this.api.actualizarUsuario(this.mdl_correo, this.mdl_contrasenaNueva, this.mdl_carrera);
          let respuesta = await lastValueFrom(datos);
          let json_texto = JSON.stringify(respuesta);
          let json = JSON.parse(json_texto);
          console.log('DGZ: ' + json.status + ' - ' + json.message);

          //se capturan los mensajes de la api segun la respuesta
          if (json.status == 'error') { //actualizacion incorrecta, mensaje parametrizado en la api
            await this.mostrarToast(json.message, 'danger', 3000);
            this.mdl_correo = '';
            this.mdl_contrasenaNueva = '';
            this.mdl_carrera = '';
            this.mdl_confirmarContrasenaNueva = '';
            this.botonDeshabilitado = false;
          } else if (json.status == 'success') { //actualizacion correcta
            await this.mostrarToast(json.message, 'success', 1500);
            await this.mostrarLoading('Volviendo a la pantalla Principal', 1500);

            //redirigir al principal
            let extras: NavigationExtras = {
              state: {
                alertReinicio: true //se envia extras para solicitar reiniciar app y volver a loguearse
              },
              replaceUrl: true
            };

            setTimeout(() => {
              this.router.navigate(['principal'], extras);
            }, 2000);
          }
        }
      }

      this.spinnerVisible = false;
    }, 1000);
  }

}
