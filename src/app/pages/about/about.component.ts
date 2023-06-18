import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Toast } from '@capacitor/toast';

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
        <ion-icon
          class="header-icon"
          name="information-circle-outline"
          slot="end"
        ></ion-icon>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-card>
        <img alt="Bolist@" src="/assets/bolista.png" />
        <ion-card-header>
          <ion-card-title>Bolist@</ion-card-title>
          <ion-card-subtitle>Tu app de control de listas</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          Todos los derechos reservados &copy; 2023
        </ion-card-content>
      </ion-card>
    </ion-content>
    <ion-footer style="color: yellow;">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button fill="clear" class="update-title" (click)="Update()"
            ><ion-icon
              slot="start"
              color="light"
              size="large"
              name="refresh-outline"
              class="update-icon"
            ></ion-icon
            >Update</ion-button
          >
        </ion-buttons>

        <ion-title slot="end" class="version-tittle"> v 1.0.0 </ion-title>
      </ion-toolbar>
    </ion-footer>
  `,
  styleUrls: ['./about.component.scss'],
  imports: [CommonModule, IonicModule],
})
export class AboutComponent {
  constructor() {}

  //Agregar aqui la lógica para realizar el update
  async Update() {
    await Toast.show({
      text: 'Sin updates',
      duration: 'short',
      position: 'bottom',
    });
  }
}
