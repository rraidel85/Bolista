import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Acerca de</ion-title>
        <ion-icon class="header-icon" name="information-circle-outline" slot="end"></ion-icon>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-card>
        <img
          alt="Bolist@"
          src="/assets/bolista.png"
        />
        <ion-card-header>
          <ion-card-title>Bolist@</ion-card-title>
          <ion-card-subtitle>Tu app de control de listas</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
         Todos los derechos reservados &copy; 2023
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
  styleUrls: ['./about.component.scss'],
  imports: [CommonModule, IonicModule],
})
export class AboutComponent {
  constructor() {}
}
