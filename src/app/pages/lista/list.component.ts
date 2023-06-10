import { Component, OnInit } from '@angular/core';
import { NightCardComponent } from './components/night-card/night-card.component';
import { DayCardComponent } from './components/day-card/day-card.component';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HoraService } from 'src/app/services/hora.service';
import { ListsService } from 'src/app/shared/services/lists.service';
import { ListElementsService } from 'src/app/services/list-elements.service';
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
        <ion-text class="hour" slot="end">{{ horaActual | hora }}</ion-text>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-item id="list-buttons" lines="none">
        <ion-label>
          <ion-grid>
            <div class="card-mid" routerLink="">
              <div class="buttons">
                <ion-button (click)="dbtest()" style="width: 99px">Cuadres</ion-button>
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

      <app-day-card></app-day-card>
      <app-night-card></app-night-card>
      <ion-list> </ion-list>
    </ion-content>
  `,
  styleUrls: ['./list.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    HoraPipe,
    DayCardComponent,
    NightCardComponent,
  ],
  providers:[ListsService,ListElementsService]
})
export class ListComponent implements OnInit {
  horaActual!: string;
 
  constructor(private horaService: HoraService,private listsService:ListsService,private listElementService:ListElementsService) {}
  

  ngOnInit() {
    this.horaService.obtenerHoraActual().subscribe(
      hora => this.horaActual = hora
    );
    
  }
  dbtest(){
    // const message='999-123456,Pase 10a19-23000000,Pase 23con24-3434,pacE (66,22,44)-123,(12,23,34)-123,23con34-3434,20al28-123,23-123-123c,82-5,92-5,24-5,16-10,61-5,27-5,41-50,33-50,35-5,65-5,66-5,25-7,41-8,11-5,50-10,45-30,82-100,28-100,68-100,86-100,60a69-10,89-100,69-50,60-10,67-5,62-5,26-5,49-5,36-2,63-2,25-2,58-2,14-2,47-2,863-1,758-1,869-1,'
    const message='Pase 01-11000-400c'
    try {
      
      // console.log(this.listsService.validateList(message));
      this.listsService.validateMessage(message)
      this.listsService.processMessage([message],1)
      console.log(this.listElementService.getAll(1));
      
    } catch (error:any) {
      console.log(error);
      console.log(error.badBets);
      
    }
  }
}
