import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-contact-list',
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Contactos</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true"> </ion-content>
  `,
  styleUrls: ['./contact-list.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class ContactListComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
