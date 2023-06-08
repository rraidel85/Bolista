import { Component, OnInit } from '@angular/core';
import { NightCardComponent } from './components/night-card/night-card.component';
import { DayCardComponent } from './components/day-card/day-card.component';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HoraService } from 'src/app/services/hora.service';
import { HoraPipe } from 'src/app/pipes/hora.pipe';

@Component({
  selector: 'app-inicio',
  template: `
   <ion-header [translucent]="true">
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-menu-button></ion-menu-button>
    </ion-buttons>
    <ion-title>Lista</ion-title>
    <ion-text class="hour" slot="end">{{horaActual|hora}}</ion-text>
    
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true">
  <ion-item id="list-buttons" lines="none">
    <ion-label>
      <ion-grid>
                
        <div class="card-mid" routerLink="">
           <div class="buttons">
            <ion-button style="width: 99px;">Cuadres</ion-button>
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
      <app-night-card [routerLink]="[]"></app-night-card>
      <ion-list> </ion-list>
    </ion-content>
  `,
  styleUrls: ['./list.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink,HoraPipe, DayCardComponent, NightCardComponent],
})
export class ListComponent  implements OnInit {

  horaActual!: string;
 
  constructor(private horaService: HoraService) {}
  

  ngOnInit() {
    this.horaService.obtenerHoraActual().subscribe(
      hora => this.horaActual = hora
    );
  }

}
