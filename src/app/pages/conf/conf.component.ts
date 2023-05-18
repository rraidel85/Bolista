import { Component, Injectable, OnInit } from '@angular/core';

@Component({
  selector: 'app-conf',
  templateUrl: './conf.component.html',
  styleUrls: ['./conf.component.scss'],
})

@Injectable({
  providedIn: 'root'
})

export class ConfComponent  implements OnInit {

  public darkMode:boolean = false;

  constructor() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: light)');
    this.darkMode = prefersDark.matches;
   }


   cambio(){
    //const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark');
   }

  ngOnInit() {}

}
