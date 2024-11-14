import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { DbService } from 'src/app/services/db.service';
import { lastValueFrom } from 'rxjs';

//importar BarcodeScanner
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

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


  /* CONSTRUCTOR ---------------------------------------------------------------------------------- */

  //inyectar dependencias
  constructor(private api: ApiService, private db: DbService) { }


  /* ngOnInit ------------------------------------------------------------------------------------- */

  async ngOnInit() {
    this.skeletonsCargando = true; //para mostrar los skeletons

    //obtener el usuario logueado para ruta de la api
    await this.obtenerCorreoLogueado();
    this.api.correoUsuario = this.correoLogueado

    await this.obtenerAsignaturasYAsistencia(); //obtener las asignaturas al iniciar la pantalla

    BarcodeScanner.installGoogleBarcodeScannerModule(); //instalar esto en el ngOnInit para que funcione

    setTimeout(async () => {
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


  /* MOSTRAR ASIGNATURAS --------------------------------------------------------------------------- */

  //calcular el porcentaje de asistencia
  calcularPorcentajeAsistencia(presente: number): number {
    let decimalAsistencia = presente / this.TOTAL_CLASES;
    return decimalAsistencia * 100;
  }

  //status de la asignatura
  determinarStatusAsignatura(porcentaje: number): string {
    return porcentaje >= 70 ? 'Aprobado' : 'Reprobado por Inasistencia';
  }

  //definir color del card segun status
  definirColorStatus(status: string): string {
    return status === 'Aprobado' ? 'success' : 'danger';
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

  async leerQRAsistencia() {
    let resultado = await BarcodeScanner.scan(); //funcion scan() del barcode

    //preguntar si el lector de qr tuvo resultado
    if (resultado.barcodes.length > 0) {
      this.textoQR = resultado.barcodes[0].displayValue; //captura el resultado
      console.log(this.textoQR);
    }
  }

}
