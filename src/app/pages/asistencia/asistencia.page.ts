import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { DbService } from 'src/app/services/db.service';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning'; //importar BarcodeScanner
import { lastValueFrom } from 'rxjs';
import { AlertController } from '@ionic/angular';

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
  TOTAL_CLASES: number = 5;
  //skeletons
  skeletonsCargando: boolean = true;
  //spinner de recarga
  spinnerRecarga: boolean = false;
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
    private alertCtrl: AlertController
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
    }, 1500); //mantener skeletons n seg.
  }


  /* OBTENER USUARIO LOGUEADO --------------------------------------------------------------------- */

  async obtenerCorreoLogueado() {
    let usuario = await this.db.obtenerUsuarioLogueado();

    if (usuario) {
      this.correoLogueado = usuario.correo;
      console.log('DGZ CORREO LOGUEADO: ' + this.correoLogueado);
    }
  }


  /* ALERT QR -------------------------------------------------------------------------------------- */

  async alertQR(titulo: string, mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      backdropDismiss: false,
      buttons: ['OK'],

    });

    await alert.present();
  }


  /* MOSTRAR ASIGNATURAS --------------------------------------------------------------------------- */

  //calcular el porcentaje de asistencia
  calcularPorcentajeAsistencia(presente: number): number {
    let decimalAsistencia = presente / this.TOTAL_CLASES;
    return decimalAsistencia * 100;
  }

  //status de la asignatura
  determinarStatusAsignatura(porcentaje: number): string {
    return porcentaje >= 70 ? 'Aprobado por Chayanne' : 'Reprobado por Inasistencia';
  }

  //definir color del card segun status
  definirColorStatus(status: string): string {
    return status === 'Aprobado por Chayanne' ? 'success' : 'danger';
  }

  //obtener los datos de las asignaturas
  async obtenerAsignaturasYAsistencia() {
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
        asignatura.sigla = json[x][y].curso_sigla;
        asignatura.nombre = json[x][y].curso_nombre;
        asignatura.presente = json[x][y].presente;
        asignatura.ausente = json[x][y].ausente;

        //calcular porcentaje de asistencia
        asignatura.porcentajeAsistencia = this.calcularPorcentajeAsistencia(asignatura.presente);
        console.log('DGZ PORCENTAJE: ' + asignatura.porcentajeAsistencia);

        //determinar status de la asignatura
        asignatura.status = this.determinarStatusAsignatura(asignatura.porcentajeAsistencia);
        console.log('DGZ STATUS: ' + asignatura.status);

        //definir color del card
        asignatura.color = this.definirColorStatus(asignatura.status);
        console.log('DGZ COLOR: ' + asignatura.color);

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
    console.log('DGZ status: ' + json.status);

    if (json.status == 'success') {
      await this.alertQR('Presente', json.message + ': ' + this.siglaQR + ' - ' + this.fechaClaseQR);
    } else if (json.status == 'error') {
      await this.alertQR('Error', json.message + ': ' + this.siglaQR + ' - ' + this.fechaClaseQR);
    }
  }

  //leer el qr de asistencia
  async leerQRAsistencia() {
    //setear variables en vacio
    this.siglaQR = '';
    this.nombreQR = '';
    this.fechaClaseQR = '';

    let resultado = await BarcodeScanner.scan(); //funcion scan() del barcode

    //preguntar si el lector de qr tuvo resultado
    if (resultado.barcodes.length > 0) {
      this.textoQR = resultado.barcodes[0].displayValue; //captura el resultado
      console.log('DGZ QR: ' + this.textoQR);
    }

    this.spinnerRecarga = true; //inicia el spinner
    this.skeletonsCargando = true; //activar nuevamente skeletons

    let textoSeparado = this.textoQR.split('|'); //funcion split
    console.log('DGZ QR separado: ' + textoSeparado);

    //extraer del split y asignar el texto a variables
    this.siglaQR = textoSeparado[0];
    this.nombreQR = textoSeparado[1];
    this.fechaClaseQR = textoSeparado[2];
    console.log('DGZ SIGLA: ' + this.siglaQR);
    console.log('DGZ NOMBRE: ' + this.nombreQR);
    console.log('DGZ FECHA: ' + this.fechaClaseQR);

    setTimeout(async () => {
      await this.marcarAsistencia(); //llamar metodo de marcar asistencia
      this.spinnerRecarga = false;
    }, 1000);

    setTimeout(async () => {
      await this.obtenerAsignaturasYAsistencia(); //actualizar asistencia
      this.skeletonsCargando = false;
    }, 2500);
  }

}
