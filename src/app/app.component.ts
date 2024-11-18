import { Component, Optional } from '@angular/core';
import { App } from '@capacitor/app';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  /* CONSTRUCTOR ------------------------------------------------------------------------------------ */

  //-ionbackbutton: https://ionicframework.com/docs/developing/hardware-back-button#exiting-the-app
  constructor(private plataforma: Platform, @Optional() private routerOutlet: IonRouterOutlet) {
    this.inicializarControladorBackButton(); //llama al metodo para el backbutton
    this.mostrarSplash(); //para mostrar el splash cuando arranque la app
  }


  /* IONBACKBUTTON ---------------------------------------------------------------------------------- */

  inicializarControladorBackButton() {
    this.plataforma.backButton.subscribeWithPriority(10, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop(); //retrocede si se puede
      } else {
        App.minimizeApp(); //si no puede retroceder, minimiza la app
      }
    });
  }


  /* SPLASH ----------------------------------------------------------------------------------------- */

  async mostrarSplash() {
    await SplashScreen.show({
      autoHide: true,
      showDuration: 2000
    });    
  }

}
