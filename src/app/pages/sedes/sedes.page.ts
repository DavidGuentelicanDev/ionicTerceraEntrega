import { Component, OnInit } from '@angular/core';
import { RefresherEventDetail, ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-sedes',
  templateUrl: './sedes.page.html',
  styleUrls: ['./sedes.page.scss'],
})
export class SedesPage implements OnInit {

  /* VARIABLES --------------------------------------------------------------------------------------- */
  
  //lista para las sedes
  lista_sedes: any[] = [];
  //skeletons
  skeletonsCargando: boolean = true;
  //modal con detalle por sede
  modalAbierto: boolean = false;
  sedeSeleccionada: any = null;
  //variables para el me gusta
  like: boolean = false;
  colorLike: string = 'light';
  tipoLike: string = 'heart-outline';
  contadorLike: number = 0;
  //obtener correo logueado
  correoLogueado: string = '';


  /* CONSTRUCTOR ------------------------------------------------------------------------------------- */

  //inyectar dependencias
  constructor(
    private api: ApiService,
    private toastCtrl: ToastController,
    private db: DbService
  ) { }


  /* ngOnInit ---------------------------------------------------------------------------------------- */

  async ngOnInit() {
    //skeletons
    this.skeletonsCargando = true;

    await this.mostrarSedes(); //mostrar sedes
    await this.obtenerCorreoLogueado(); //obtener el correo logueado

    setTimeout(async () => {
      this.skeletonsCargando = false;
    }, 3000); //mantener skeletons n seg.
  }


  /* TOAST ------------------------------------------------------------------------------------------- */

  async mostrarToast(mensaje: string, color: string, duracion: number) {
    let toast = await this.toastCtrl.create({
      message: mensaje,
      color: color,
      duration: duracion,
      cssClass: 'toast' //clase del global.scss
    });

    await toast.present();
  }


  /* REFRESHER -------------------------------------------------------------------------------------- */

  async activarRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(async () => {
      //elementos que se van a recargar
      this.skeletonsCargando = true;
      await this.mostrarSedes();
      setTimeout(() => {
        this.skeletonsCargando = false;
      }, 3000);

      (event.target as HTMLIonRefresherElement).complete(); //refresher completo
    }, 1000);
  }


  /* OBTENER CORREO LOGUEADO ------------------------------------------------------------------------ */

  async obtenerCorreoLogueado () {
    let usuario = await this.db.obtenerUsuarioLogueado();

    if (usuario) {
      this.correoLogueado = usuario.correo;
      console.log('DGZ: usuario en la db ' + this.correoLogueado);
    }
  }


  /* SEDES-MODAL -------------------------------------------------------------------------------- */

  //funcion para mostrar sedes
  async mostrarSedes() {
    let datos = this.api.mostrarSedes();
    let respuesta = await lastValueFrom(datos);
    let json_texto = JSON.stringify(respuesta);
    let json = JSON.parse(json_texto);

    //limpiar lista
    this.lista_sedes = [];

    //recorrer primer arreglo
    for (let i = 0; i < json.length; i++) {
      //recorrer segundo arreglo
      for (let j = 0; j < json[i].length; j++) {
        let sede: any = {};
        sede.nombre = json[i][j].NOMBRE;
        sede.direccion = json[i][j].DIRECCION;
        sede.telefono = json[i][j].TELEFONO;
        sede.horario = json[i][j].HORARIO_ATENCION;
        sede.imagen = json[i][j].IMAGEN;

        this.lista_sedes.push(sede); //guardar en la lista
      }
    }
  }

  //funcion para abrir el modal con el detalle por sede
  async abrirModal(sede: any) {
    this.sedeSeleccionada = sede;
    this.modalAbierto = true;

    //verificar si hay like guardado en la tabla megusta para cada sede, y contarlos
    await this.existeLike();
    await this.contarLikePorSede();
  }

  //funcion para cerrar el modal
  cerrarModal() {
    this.modalAbierto = false;
  }


  /* SEDES-MODAL-LIKE ------------------------------------------------------------------------------- */

  //funcion para guardar el me gusta
  async guardarLike() {
    await this.db.guardarLike(this.correoLogueado, this.sedeSeleccionada.nombre);
  }

  //funcion para eliminar like
  async eliminarLike() {
    await this.db.eliminarLike(this.correoLogueado, this.sedeSeleccionada.nombre);
  }

  //funcion para dar like
  async darLike() {
    if (this.like == false) { //dar like
      this.like = true;
      this.colorLike = 'danger';
      this.tipoLike = 'heart';

      try {
        //guardar like en la tabla megusta
        await this.guardarLike();
        await this.contarLikePorSede(); //actualiza el contador
        await this.mostrarToast('Me gusta', 'dark', 1000);
      } catch (e) {
        console.log('DGZ: Error al guardar me gusta ' + JSON.stringify(e));
      }
    } else { //quitar like
      this.like = false;
      this.colorLike = 'light';
      this.tipoLike = 'heart-outline';

      try {
        //eliminar el like de la tabla megusta
        await this.eliminarLike();
        await this.contarLikePorSede(); //actualiza el contador
        await this.mostrarToast('Ya NO me gusta', 'dark', 1000);
      } catch (e) {
        console.log('DGZ: Error al eliminar me gusta ' + JSON.stringify(e));
      }
    }
  }

  //verificar si existe like por sede
  async existeLike() {
    let likeGuardado = await this.db.existeLike(this.correoLogueado, this.sedeSeleccionada.nombre);

    //activa la logica front del like
    if (likeGuardado) {
      this.like = true;
      this.colorLike = 'danger';
      this.tipoLike = 'heart';
    } else {
      this.like = false;
      this.colorLike = 'light';
      this.tipoLike = 'heart-outline';
    }
  }

  //contar los likes por sede
  async contarLikePorSede() {
    let contador = await this.db.contarLikePorSede(this.sedeSeleccionada.nombre);
    this.contadorLike = contador;
  }

}
