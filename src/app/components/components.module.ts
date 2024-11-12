import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//importar los componentes
import { BarraMenuComponent } from './barra-menu/barra-menu.component';
//importar ionic modules
import { IonicModule } from '@ionic/angular';

@NgModule({
  //traer los componentes
  declarations: [BarraMenuComponent],
  imports: [
    CommonModule,
    IonicModule //agregar ionic module
  ],
  //agregar exports: [con los componentes]
  exports: [BarraMenuComponent]
})
export class ComponentsModule { }
