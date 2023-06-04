import { Component, OnInit } from '@angular/core';
import { NightCardComponent } from './ui/night-card/night-card.component';
import { DayCardComponent } from './ui/day-card/day-card.component';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule, NgFor, NgForOf } from '@angular/common';

@Component({
  selector: 'app-inicio',
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Lista</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-item id="list-buttons" lines="none">
        <ion-label>
          <ion-grid>
            <div class="card-mid" routerLink="">
              <div class="buttons">
                <ion-button style="width: 99px">Cuadres</ion-button>
                <ion-button>Patrones</ion-button>
              </div>

              <div class="buttons">
                <ion-button>Patrones</ion-button>
                <ion-button>Patrones</ion-button>
              </div>

              <div class="buttons">
                <ion-button>Patrones</ion-button>
                <ion-button>Patrones</ion-button>
              </div>
            </div>
          </ion-grid>
        </ion-label>
      </ion-item>

      <app-day-card [routerLink]="['contactos']"></app-day-card>
      <app-night-card [routerLink]="['contactos','58630864']"></app-night-card>
      <ion-list> </ion-list>
    </ion-content>
  `,
  styleUrls: ['./list.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, DayCardComponent, NightCardComponent],
})
export class ListComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
