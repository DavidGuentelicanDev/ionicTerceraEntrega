import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActualizacionDatosPageRoutingModule } from './actualizacion-datos-routing.module';

import { ActualizacionDatosPage } from './actualizacion-datos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActualizacionDatosPageRoutingModule
  ],
  declarations: [ActualizacionDatosPage]
})
export class ActualizacionDatosPageModule {}
