import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HoraPipe } from 'src/app/pipes/hora.pipe';
import { HoraService } from 'src/app/services/hora.service';


@Component({
  selector: 'app-detail-option',
  standalone: true,
  template: `<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-menu-button></ion-menu-button>
    </ion-buttons>
    <ion-title>Detalles</ion-title>
    <ion-text class="hour" slot="end">{{ horaActual | hora }}</ion-text>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true">
  <ion-segment value="Detalles" (ionChange)="segmentChanged($event)">
    <ion-segment-button value="Detalles">
      <ion-label>Detalles</ion-label>
    </ion-segment-button>
    <ion-segment-button value="Pase">
      <ion-label>Pase</ion-label>
    </ion-segment-button>
    <ion-segment-button value="Pase+">
      <ion-label>Pase+</ion-label>
    </ion-segment-button>
  </ion-segment>

  <!-- Detalles -->
  <ng-container *ngIf="tabSeleccionado === 'Detalles'">
    <div class="page-tab-header">
      <div class="page-tab-header-date">
        <ion-icon id="day-icon" name="sunny"></ion-icon>
        <ion-text>{{horaActual | date}}</ion-text>
      </div>
      <ion-label style="flex-grow: 1;">Todos</ion-label>
    </div>
    <ion-card *ngFor="let number of numberList">
      <ion-card-content>
        <ion-text class="first">{{ number.index }}</ion-text>
        <div class="second">
          <ion-text >{{ number.randomNumber }}</ion-text>
        </div>
        <div class="checkbox">
          <ion-checkbox slot="end"></ion-checkbox>
        </div>
      </ion-card-content>
    </ion-card>
  </ng-container>

  <ion-fab slot="fixed" vertical="bottom" horizontal="end">
    <ion-fab-button>
      <ion-icon name="share-social"></ion-icon>
    </ion-fab-button>
    <ion-fab-list side="top">
      <ion-fab-button>
        <ion-icon name="copy"></ion-icon>
      </ion-fab-button>
      <ion-fab-button>
        <ion-icon name="send"></ion-icon>
      </ion-fab-button>
      <ion-fab-button>
        <ion-icon name="share-social"></ion-icon>
      </ion-fab-button>
    </ion-fab-list>
  </ion-fab>
</ion-content>
`,
  styleUrls: ['./detail-option.component.scss'],
  
  imports: [CommonModule, IonicModule, HoraPipe]
})
export class DetailOptionComponent  implements OnInit {

  horaActual!: string;
  tabSeleccionado: string = 'Detalles';
  numberList: any[] = [];
 
  constructor(private horaService: HoraService) {
    for (let i = 0; i < 100; i++) {
      const randomNumber = Math.floor(Math.random() * 400) + 1;
      const index = i.toString().padStart(2, '0');
      const bet = { index, randomNumber };
      this.numberList.push(bet);
    }
  }
  

  ngOnInit() {
    this.horaService.obtenerHoraActual().subscribe(
      hora => this.horaActual = hora
    );
  }

  segmentChanged(event: any){
    this.tabSeleccionado = event.target.value;
  }
}
