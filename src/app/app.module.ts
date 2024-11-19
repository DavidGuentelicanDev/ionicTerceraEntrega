import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http'; //importacion para APIs
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; //importacion para sqlite

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule], //agregar HttpClientModule para Apis
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, SQLite], //agregar sqlite aca
  bootstrap: [AppComponent],
})
export class AppModule {}
