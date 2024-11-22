import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { DbService } from 'src/app/services/db.service';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning'; //importar BarcodeScanner
import { lastValueFrom } from 'rxjs';
import { AlertController, LoadingController, RefresherEventDetail } from '@ionic/angular';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit {

  /* VARIABLES ------------------------------------------------------------------------------------ */

  //obtener correo logueado
  correoLogueado: string = '';
  //variables de las asignaturas
  lista_asignaturas: any[] = [];
  totalClases: number = 0;
  decimalAsistencia: number = 0;
  porcentajeAsistencia: number = 0;
  estadoAsignatura: string = '';
  colorPorEstado: string = '';
  //skeletons
  skeletonsCargando: boolean = true;
  //para capturar texto de qr
  textoQR: string = '';
  siglaQR: string = '';
  nombreQR: string = '';
  fechaClaseQR: string = '';


  /* CONSTRUCTOR ---------------------------------------------------------------------------------- */

  //inyectar dependencias
  constructor(
    private api: ApiService,
    private db: DbService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) { }


  /* ngOnInit ------------------------------------------------------------------------------------- */

  async ngOnInit() {
    this.skeletonsCargando = true; //para mostrar los skeletons

    //obtener el usuario logueado para ruta de la api
    await this.obtenerCorreoLogueado();
    this.api.correoUsuario = this.correoLogueado

    await this.obtenerAsignaturasYAsistencia(); //obtener las asignaturas al iniciar la pantalla

    BarcodeScanner.installGoogleBarcodeScannerModule(); //instalar esto en el ngOnInit para que funcione

    setTimeout(() => {
      this.skeletonsCargando = false;
    }, 1000); //mantener skeletons n seg.
  }


  /* OBTENER USUARIO LOGUEADO --------------------------------------------------------------------- */

  async obtenerCorreoLogueado() {
    let usuario = await this.db.obtenerUsuarioLogueado();

    if (usuario) {
      this.correoLogueado = usuario.correo;
      console.log('DGZ CORREO LOGUEADO: ' + this.correoLogueado);
    }
  }


  /* ALERT ----------------------------------------------------------------------------------------- */

  async alertQR(titulo: string, mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      backdropDismiss: true
    });

    await alert.present();

    //el alert se desaparece a los n seg. si el usuario no presiona fuera
    setTimeout(async () => {
      await alert.dismiss();
    }, 2000);
  }


  /* REFRESHER -------------------------------------------------------------------------------------- */

  async activarRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(async () => {
      //elementos que se van a recargar
      this.skeletonsCargando = true;
      await this.obtenerAsignaturasYAsistencia();

      setTimeout(() => {
        this.skeletonsCargando = false;
      }, 1000);

      (event.target as HTMLIonRefresherElement).complete(); //refresher completo
    }, 1000);
  }


  /* MOSTRAR ASIGNATURAS --------------------------------------------------------------------------- */

  //calcular el porcentaje de asistencia
  calcularPorcentajeAsistencia(presente: number) {
    //resetear variables
    this.decimalAsistencia = 0;
    this.porcentajeAsistencia = 0;
    this.totalClases = 5;

    //calculo
    this.decimalAsistencia = presente / this.totalClases;
    this.porcentajeAsistencia = this.decimalAsistencia * 100;
  }

  //status de la asignatura
  determinarEstadoAsignatura(porcentaje: number) {
    //resetear variables
    this.estadoAsignatura = '';

    //calculo
    if (porcentaje < 70) {
      this.estadoAsignatura = 'Reprobado por Inasistencia';
    } else if (porcentaje >= 70) {
      this.estadoAsignatura = 'Aprobado por Chayanne';
    }
  }

  //definir color del card segun status
  definirColorEstado(estado: string) {
    //resetear variables
    this.colorPorEstado = '';

    //calculo
    if (estado == 'Reprobado por Inasistencia') {
      this.colorPorEstado = 'danger';
    } else if (estado == 'Aprobado por Chayanne') {
      this.colorPorEstado = 'success';
    }
  }

  //obtener los datos de las asignaturas
  async obtenerAsignaturasYAsistencia() {
    let datos = this.api.obtenerAsignaturasYAsistencia();
    let respuesta = await lastValueFrom(datos);
    let json_texto = JSON.stringify(respuesta);
    let json = JSON.parse(json_texto);

    this.lista_asignaturas = []; //limpiar lista

    //recorrer primer arreglo
    for (let x = 0; x < json.length; x++) {
      //recorrer segundo arreglo
      for (let y = 0; y < json[x].length; y++) {
        let asignatura: any = {}; //objeto que recibira cada asignatura
        asignatura.sigla = json[x][y].curso_sigla;
        asignatura.nombre = json[x][y].curso_nombre;
        asignatura.presente = json[x][y].presente;
        asignatura.ausente = json[x][y].ausente;

        //calcular porcentaje de asistencia de la asignatura
        this.calcularPorcentajeAsistencia(asignatura.presente);
        asignatura.porcentajeAsistencia = this.porcentajeAsistencia;

        //determinar estado de la asignatura
        this.determinarEstadoAsignatura(asignatura.porcentajeAsistencia);
        asignatura.estado = this.estadoAsignatura;

        //definir color del card
        this.definirColorEstado(asignatura.estado);
        asignatura.color = this.colorPorEstado;

        console.log('DGZ: ' + asignatura.sigla + ' ' + asignatura.nombre + ' presente: ' + asignatura.presente + ' ausente: ' + asignatura.ausente + ' porcentaje: ' + asignatura.porcentajeAsistencia + ' estado: ' + asignatura.estado + ' color: ' + asignatura.color);

        this.lista_asignaturas.push(asignatura); //guardar en la lista
      }
    }
  }


  /* LECTURA DE QR -------------------------------------------------------------------------------- */

  //enviar asistencia para marcar
  async marcarAsistencia() {
    let datos = this.api.marcarAsistencia(this.siglaQR, this.correoLogueado, this.fechaClaseQR);
    let respuesta = await lastValueFrom(datos);
    let json_texto = JSON.stringify(respuesta);
    let json = JSON.parse(json_texto);
    console.log('DGZ status: ' + json.status + ' - ' + json.message);

    if (json.status == 'success') {
      await this.alertQR(json.message, 'Quedó presente para la clase de ' + this.nombreQR + ' del día ' + this.fechaClaseQR);
    } else if (json.status == 'error' && json.message == 'Usted ya se encuentra presente') {
      await this.alertQR(json.message, 'Ya marcó asistencia para la clase de ' + this.nombreQR + ' del día ' + this.fechaClaseQR);
    } else if (json.status == 'error' && json.message == 'La sigla ingresada no existe') {
      await this.alertQR(json.message, 'El código QR no corresponde a ninguna asignatura registrada');
    } else if (json.status == 'error' && json.message == 'Todos los campos son obligatorios') {
      await this.alertQR('Error', 'El código QR es inválido');
    }
  }

  //leer el qr de asistencia
  async leerQRAsistencia() {
    //setear variables en vacio
    this.siglaQR = '';
    this.nombreQR = '';
    this.fechaClaseQR = '';

    //crear loading
    const loading = await this.loadingCtrl.create({
      message: 'Leyendo el código QR...',
      spinner: 'circles'
    });

    try {
      let resultado = await BarcodeScanner.scan(); //leer qr
      await loading.present(); //llamar al loading

      setTimeout(async () => {
        //preguntar si el lector de qr tuvo resultado
        if (resultado.barcodes.length > 0) {
          this.textoQR = resultado.barcodes[0].displayValue; //captura el resultado
          console.log('DGZ QR: ' + this.textoQR);

          //procesar y separar el texto obtenido del qr
          let textoSeparado = this.textoQR.split('|'); //funcion split
          console.log('DGZ QR separado: ' + textoSeparado);

          //extraer del split y asignar el texto a variables
          this.siglaQR = textoSeparado[0];
          this.nombreQR = textoSeparado[1];
          this.fechaClaseQR = textoSeparado[2];
          console.log('DGZ SIGLA: ' + this.siglaQR);
          console.log('DGZ NOMBRE: ' + this.nombreQR);
          console.log('DGZ FECHA: ' + this.fechaClaseQR);
        }

        this.skeletonsCargando = true; //skeletons activados
        await loading.dismiss(); //cerrar loading luego de finalizar el proceso
        await this.marcarAsistencia(); //llamar metodo de marcar asistencia
        await this.obtenerAsignaturasYAsistencia(); //actualizar asistencia

        //sekeletons desactivados luego de n seg.
        setTimeout(() => {
          this.skeletonsCargando = false;
        }, 2000);
      }, 1000);
    } catch (e) {
      console.log('DGZ ERROR-QR: ' + JSON.stringify(e));
    }
  }

}
