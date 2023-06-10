import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HoraPipe } from 'src/app/pipes/hora.pipe';
import { HoraService } from 'src/app/services/hora.service';
import { ListElementsService } from 'src/app/services/list-elements.service';
import { Detail } from 'src/app/shared/interfaces/picks.interface';

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
            <ion-text>{{ horaActual | date }}</ion-text>
          </div>
          <ion-label style="flex-grow: 1;">Todos</ion-label>
        </div>
        <ion-card *ngFor="let number of paseList">
          <ion-card-content>
            <ion-text class="first">{{ number.pick }}</ion-text>
            <div class="second">
              <ion-text >{{ number.price }}</ion-text>
              <ion-text *ngIf="number.corrido">{{
                number.corrido
              }}c</ion-text>
            </div>
            <div class="checkbox">
              <ion-checkbox slot="end"></ion-checkbox>
            </div>
          </ion-card-content>
        </ion-card>
        <ion-segment *ngIf="paseList.length!==0">-------------------------------------</ion-segment>
        <ion-card *ngFor="let number of numberList">
          <ion-card-content>
            <ion-text class="first">{{ number.pick }}</ion-text>
            <div class="second">
              <ion-text >{{ number.price }}</ion-text>
              <ion-text *ngIf="number.corrido">{{
                number.corrido
              }}c</ion-text>
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
    </ion-content> `,
  styleUrls: ['./detail-option.component.scss'],

  imports: [CommonModule, IonicModule, HoraPipe],
  providers: [ListElementsService],
})
export class DetailOptionComponent implements OnInit {
  horaActual!: string;
  tabSeleccionado: string = 'Detalles';
  numberList: Detail[] = [];
  paseList: Detail[] = [];

  constructor(
    private horaService: HoraService,
    private listElementService: ListElementsService
  ) {
    
  }

  ngOnInit() {
    this.horaService
      .obtenerHoraActual()
      .subscribe((hora) => (this.horaActual = hora));
      this.listElementService.getAll(1).then((ret) => {
        ret.forEach((element) => {
          let obj: Detail = {
            pick: element.pick,
            price: element.price,
            amount: element.amount,
          };
          if (element.corrido) {
            obj.corrido = element.corrido;
          }
          if (element.price !== 0) {
            this.numberList.push({ ...obj, pase: false });
          }
          if (element.pase) {
            obj.price = element.pase;
            this.paseList.push({ ...obj, pase: true });
          }
        });
        const order = [2, 7, 10, 3];
        this.numberList.sort((a, b) => {
          if (order.indexOf(a.pick.length) === order.indexOf(b.pick.length)) {
            const nameA = a.pick.toUpperCase();
            const nameB = b.pick.toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          }
          return order.indexOf(a.pick.length) - order.indexOf(b.pick.length);
        });
        this.paseList.sort((a, b) => {
          if (order.indexOf(a.pick.length) === order.indexOf(b.pick.length)) {
            const nameA = a.pick.toUpperCase();
            const nameB = b.pick.toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          }
          return order.indexOf(a.pick.length) - order.indexOf(b.pick.length);
        });
      });
  }

  segmentChanged(event: any) {
    this.tabSeleccionado = event.target.value;
  }
}
