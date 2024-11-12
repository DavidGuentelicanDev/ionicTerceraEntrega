import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

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
  skeletons = Array(11);
  skeletonsCargando: boolean = true;
  //modal con detalle por sede
  modalAbierto: boolean = false;
  sedeSeleccionada: any = null;


  /* CONSTRUCTOR ------------------------------------------------------------------------------------- */

  //inyectar dependencias
  constructor(private api: ApiService, private toastCtrl: ToastController) { }


  /* ngOnInit ---------------------------------------------------------------------------------------- */

  async ngOnInit() {
    //skeletons
    this.skeletonsCargando = true;

    await this.mostrarSedes(); //mostrar sedes

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
      position: 'bottom',
      mode: 'md', //diseño de material design
      cssClass: 'toast' //clase del global.scss
    });
    toast.present();
  }


  /* SEDES ------------------------------------------------------------------------------------------- */

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

        //guardar en la lista
        this.lista_sedes.push(sede);
      }
    }
  }

  //funcion para abrir el modal con el detalle por sede
  async abrirModal(sede: any) {
    this.sedeSeleccionada = sede;
    this.modalAbierto = true;

    // //verificar si hay me gusta guardado en la tabla me_gusta para cada sede, y contarlos
    // await this.existeMeGusta();
    // await this.contarMeGustaPorSede();
  }

  //funcion para cerrar el modal
  cerrarModal() {
    this.modalAbierto = false;
  }

}
