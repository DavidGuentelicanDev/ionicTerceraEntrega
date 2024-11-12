import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActualizacionDatosPageRoutingModule } from './actualizacion-datos-routing.module';

import { ActualizacionDatosPage } from './actualizacion-datos.page';

//importar componente
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActualizacionDatosPageRoutingModule,
    ComponentsModule //agregar
  ],
  declarations: [ActualizacionDatosPage]
})
export class ActualizacionDatosPageModule {}
