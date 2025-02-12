import { Component, AfterViewInit } from '@angular/core';

declare var Mmenu: any;

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements AfterViewInit {
  ngAfterViewInit() {
    const menuElement = document.querySelector('#menu');
    if (menuElement) {
      new Mmenu(menuElement);
    }
  }
}
