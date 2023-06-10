import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChildren } from '@angular/core';
import { IonCheckbox, IonicModule, ModalController } from '@ionic/angular';
import { Clipboard } from '@capacitor/clipboard';
import { HoraPipe } from 'src/app/pipes/hora.pipe';
import { HoraService } from 'src/app/services/hora.service';
import { ListElementsService } from 'src/app/services/list-elements.service';
import { Detail, Details } from '../../interfaces/details.interface';
import { AddModalComponent } from '../add-modal/add-modal.component';
import { BolistaDbService } from 'src/app/services/bolista-db.service';
import { ListsService } from 'src/app/shared/services/lists.service';

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
      <ng-container>
        <div class="page-tab-header">
          <div class="page-tab-header-date">
            <ion-icon id="day-icon" name="sunny"></ion-icon>
            <ion-text>{{ horaActual | date }}</ion-text>
          </div>
          <ion-label style="flex-grow: 1;">Todos</ion-label>
        </div>
        <div>
          <ion-card *ngFor="let number of paseList">
            <ion-card-content>
              <ion-text class="first">{{ number.pick }}</ion-text>
              <div class="second">
                <ion-text>{{ number.price }}</ion-text>
                <ion-text *ngIf="number.corrido"
                  >{{ number.corrido }}c</ion-text
                >
              </div>
              <div class="checkbox">
                <ion-checkbox #paseCheckbox [value]="number.pick" slot="end"></ion-checkbox>
              </div>
            </ion-card-content>
          </ion-card>
          <ion-segment>-------------------------------------</ion-segment>
          <ion-card *ngFor="let number of numberList">
            <ion-card-content>
              <ion-text class="first">{{ number.pick }}</ion-text>
              <div class="second">
                <ion-text>{{ number.price }}</ion-text>
                <ion-text *ngIf="number.corrido"
                  >{{ number.corrido }}c</ion-text
                >
              </div>
              <div class="checkbox">
                <ion-checkbox #numberCheckbox [value]="number.pick" slot="end"></ion-checkbox>
              </div>
            </ion-card-content>
          </ion-card>
        </div>
      </ng-container>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button>
          <ion-icon name="share-social"></ion-icon>
        </ion-fab-button>
        <ion-fab-list side="top">
          <ion-fab-button (click)="getChecked()">
            <ion-icon name="copy"></ion-icon>
          </ion-fab-button>
          <ion-fab-button (click)="openAddModal()">
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
  providers: [ListElementsService,ListsService],
})
export class DetailOptionComponent implements OnInit {
  horaActual!: string;
  tabSeleccionado: string = 'Detalles';
  pase = 0;
  pasePlus = 0;
  numberList: Detail[] = [];
  paseList: Detail[] = [];
  numberDetails: Details = {
    original:[],
    details: [],
    pase: [],
    pasePlus: [],
  };
  paseDetails: Details = {
    original:[],
    details: [],
    pase: [],
    pasePlus: [],
  };

  @ViewChildren('paseCheckbox') paseCheckboxes!: IonCheckbox[]
  @ViewChildren('numberCheckbox') numberCheckboxes!: IonCheckbox[]

  constructor(
    private horaService: HoraService,
    private listElementService: ListElementsService,
    private listsService: ListsService,
    private db: BolistaDbService,
    private modalCtrl: ModalController
  ) {}

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
          this.numberDetails.original.push({ ...obj, pase: false });
        }
        if (element.pase) {
          obj.price = element.pase;
          this.paseDetails.original.push({ ...obj, pase: true });
        }
      });
      const order = [2, 7, 10, 3];
      this.numberDetails.original.sort((a, b) => {
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
      this.paseDetails.original.sort((a, b) => {
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
      this.paseDetails.details=[...this.paseDetails.original]
      this.numberDetails.details=[...this.numberDetails.original]
      this.numberList = this.numberDetails.original;
      this.paseList = this.paseDetails.original

    });
    this.db.mDb.query(`SELECT * FROM pases`).then((ret) => {
      this.pase = ret.values![0].pase;
      this.pasePlus = ret.values![0].pase_plus;
      // this.setPase();
    });
  }

  async openAddModal() {
    const modal = await this.modalCtrl.create({
      component: AddModalComponent,
      cssClass: 'add-modal-css',
    });
    modal.onDidDismiss().then((result) => {
      if (result.data) {        
        this.addPase(result.data.value); 
      }
    });
    return await modal.present();
  }
  segmentChanged(event: any) {
    this.tabSeleccionado = event.target.value;

    if (this.tabSeleccionado === 'Detalles') {
      this.numberList = this.numberDetails.details;
      this.paseList = this.paseDetails.details;
    } else if (this.tabSeleccionado === 'Pase') {
      this.numberList = this.numberDetails.pase;
      this.paseList = this.paseDetails.pase;
    } else if (this.tabSeleccionado === 'Pase+') {
      this.numberList = this.numberDetails.pasePlus;
      this.paseList = this.paseDetails.pasePlus;
    }
  }
  addPase(pase: number) {
    if (this.tabSeleccionado === 'Detalles') {
      this.pase = pase;
      this.db.mDb.execute(`UPDATE pases SET pase=${pase}`).then((ret) => {
        this.setPase();
      });
    } else if (this.tabSeleccionado === 'Pase') {
      this.pasePlus = pase;
      this.db.mDb.execute(`UPDATE pases SET pase_plus=${pase}`).then((ret) => {
        this.setPase();
      });
    }
  }
  private setPase() {
    if (this.pase !== 0) {
      this.paseDetails.pase=[]
      this.numberDetails.pase=[]
      this.paseDetails.pasePlus=[]
        this.numberDetails.pasePlus=[]
      
      this.paseDetails.details = this.paseDetails.original.map((obj) => {
        let newObj = { ...obj,corrido:undefined };
        let newObj2 = { ...obj };
        if (newObj2.price > this.pase) {
          newObj.price -= this.pase;
          newObj2.price = this.pase;
          this.paseDetails.pase.push(newObj);
        }
        return newObj2;
      });
      this.numberDetails.details = this.numberDetails.original.map((obj) => {
        let newObj = { ...obj,corrido:undefined };
        let newObj2 = { ...obj };
        if (newObj2.price > this.pase) {
          newObj.price -= this.pase;
          newObj2.price = this.pase;
          this.numberDetails.pase.push(newObj);
        }
        return newObj2;
      });
      if (this.pasePlus !== 0) {
        
        
        
        this.paseDetails.pase = this.paseDetails.pase.map((obj) => {
          let newObj = { ...obj};
          let newObj2 = { ...obj };
          if (obj.price > this.pasePlus) {
            newObj.price -= this.pasePlus;
            newObj2.price = this.pasePlus;
            this.numberDetails.pasePlus.push(newObj);
          }
          return newObj2;
        });
        this.numberDetails.pase = this.numberDetails.pase.map((obj) => {
          let newObj = { ...obj };
          let newObj2 = { ...obj };
          if (newObj2.price > this.pasePlus) {
            newObj.price -= this.pasePlus;
            newObj2.price = this.pasePlus;
            this.numberDetails.pasePlus.push(newObj);
          }
          return newObj2;
        }); 
      }
    }else{      
      this.paseDetails.pase=[]
      this.numberDetails.pase=[]
      this.paseDetails.pasePlus=[]
      this.numberDetails.pasePlus=[]
      this.paseDetails.details=[...this.paseDetails.original]
      this.numberDetails.details=[...this.numberDetails.original]
    }
    if (this.tabSeleccionado === 'Detalles') {
      this.numberList = this.numberDetails.details;
      this.paseList = this.paseDetails.details;
    } else if (this.tabSeleccionado === 'Pase') {
      this.numberList = this.numberDetails.pase;
      this.paseList = this.paseDetails.pase;
    }
  }
  getChecked(){
    const copyPase:Detail[]=[]
    const copyNumber:Detail[]=[]
    this.paseCheckboxes.forEach(box=>{
      if (box.checked){
        const element:Detail =this.paseList.filter(x=>x.pick===box.value)[0]
        copyPase.push(element)
      }
    })
    this.numberCheckboxes.forEach(box=>{
      if (box.checked){
        const element:Detail =this.numberList.filter(x=>x.pick===box.value)[0]
        copyNumber.push(element)
      }
    })
    const message= this.listsService.listToText(copyPase,copyNumber)
    // console.log(message);
    Clipboard.write({string: message})
  }
}
