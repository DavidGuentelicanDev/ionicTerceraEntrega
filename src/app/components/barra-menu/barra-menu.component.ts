import { Component, Input, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-barra-menu',
  templateUrl: './barra-menu.component.html',
  styleUrls: ['./barra-menu.component.scss'],
})
export class BarraMenuComponent  implements OnInit {

  //variables dinamicas del componente
  @Input() titulo: string = '';

  //inyectar dependencias
  constructor(private menuCtrl: MenuController) { }

  ngOnInit() {}

  //abrir el menu lateral
  abrirMenu() {
    this.menuCtrl.open('end');
  }

}
