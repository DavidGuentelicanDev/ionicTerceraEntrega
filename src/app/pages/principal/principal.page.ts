import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, RefresherEventDetail, ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
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
  //lista para asignaturas
  lista_asignaturas: any[] = [];
  //barra de progreso para simular una carga
  barraProgresoVisible: boolean = false;


  /* CONSTRUCTOR --------------------------------------------------------------------------------- */

  //inyectar dependencias
  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private db: DbService,
    private api: ApiService
  ) { }


  /* ngOnInit --------------------------------------------------------------------------------- */

  async ngOnInit() {
    //extras para reiniciar luego de cambiar contraseña
    let extras = this.router.getCurrentNavigation()?.extras;

    if (extras?.state) {
      this.reiniciar();
    }

    this.skeletonsCargando = true; //para mostrar los skeletons

    await this.mostrarUsuarioLogueado(); //mostrar usuario logueado guardado en db
    this.api.correoUsuario = this.correo; //asignar que el correo de usuario logueado sea el correo de la ruta de la api
    await this.obtenerAsignaturas(); //obtener los datos de las asignaturas del usuario logueado

    setTimeout(() => {
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

    await toast.present();
  }


  /* REFRESHER -------------------------------------------------------------------------------------- */

  handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      //elementos que se van a recargar
      this.skeletonsCargando = true;
      this.mostrarUsuarioLogueado();
      this.api.correoUsuario = this.correo;
      this.obtenerAsignaturas();
      setTimeout(() => {
        this.skeletonsCargando = false;
      }, 1000);

      (event.target as HTMLIonRefresherElement).complete(); //refresher completo
    }, 1000);
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
    this.barraProgresoVisible = true;

    //primero borrar el usuario logueado
    await this.eliminarUsuarioLogueado(this.correo);

    let extras: NavigationExtras = {
      replaceUrl: true
    }

    this.mostrarToast('Cerrando sesión', 'tertiary', 1500);

    setTimeout(() => {
      this.barraProgresoVisible = false;
      this.router.navigate(['login'], extras);
    }, 2000);
  }

  //funcion para reiniciar cuando se cambie contraseña
  async reiniciar() {
    let alert = await this.alertCtrl.create({
      header: 'Reiniciar aplicación',
      message: 'Para aplicar el cambio de contraseña, es necesario reiniciar la aplicación',
    });

    await alert.present();

    //se cierra automaticamente a los n seg.
    setTimeout(async () => {
      await alert.dismiss();
      this.logout();
    }, 1500);
  }

  //funcion para borrar usuario logueado
  async eliminarUsuarioLogueado(correo: string) {
    await this.db.eliminarUsuarioLogueado(correo);
  }


  /* MOSTRAR ASIGNATURAS --------------------------------------------------------------------------- */

  async obtenerAsignaturas() {
    let datos = this.api.obtenerAsignaturasYAsistencia();
    let respuesta = await lastValueFrom(datos);
    let json_texto = JSON.stringify(respuesta);
    console.log('DGZ asignaturas: ' + json_texto);
    let json = JSON.parse(json_texto);

    this.lista_asignaturas = []; //limpiar lista

    //recorrer primer arreglo
    for (let x = 0; x < json.length; x++) {
      //recorrer segundo arreglo
      for (let y = 0; y < json[x].length; y++) {
        let asignatura: any = {}; //objeto que recibira cada asignatura
        asignatura.nombre = json[x][y].curso_nombre;

        this.lista_asignaturas.push(asignatura); //guardar en la lista
      }
    }
  }

}
