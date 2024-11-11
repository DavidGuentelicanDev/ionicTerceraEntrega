import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SedesPage } from './sedes.page';

const routes: Routes = [
  {
    path: '',
    component: SedesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SedesPageRoutingModule {}
