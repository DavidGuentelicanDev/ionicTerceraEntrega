import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  //inyectar dependencias
  constructor(private router: Router) { }

  ngOnInit() {
    let extras: NavigationExtras = {
      replaceUrl: true
    }

    setTimeout(() => {
      this.router.navigate(['login'], extras);
    }, 2000);
  }

}
