import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActualizacionDatosPage } from './actualizacion-datos.page';

const routes: Routes = [
  {
    path: '',
    component: ActualizacionDatosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActualizacionDatosPageRoutingModule {}
