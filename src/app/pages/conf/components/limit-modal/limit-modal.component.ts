import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChildren } from '@angular/core';
import { IonCheckbox, IonicModule, ModalController } from '@ionic/angular';
import { AddModalComponent } from '../add-modal/add-modal.component';
import { FormsModule } from '@angular/forms';
import { BolistaDbService } from 'src/app/services/bolista-db.service';

@Component({
  selector: 'app-limit-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="cancel()">Cerrar</ion-button>
        </ion-buttons>
        <ion-title class="ion-text-center">Limitados</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-label>Tiro:</ion-label>
          <ion-select
            [(ngModel)]="selectedOption"
            interface="popover"
            (ionChange)="changeCards()"
          >
            <ion-select-option value="mediodia">Mediodía</ion-select-option>
            <ion-select-option value="noche">Noche</ion-select-option>
          </ion-select>
        </ion-item>

        <!-- Mediodía -->
        <ng-container *ngIf="selectedOption === 'mediodia'">
          <ion-card class="card" *ngFor="let pick of dayCards">
            <ion-card-header>
              <ion-card-title class="card-number">{{ pick }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <div class="card-content">
                <ion-checkbox
                  #checkboxDay
                  class="card-checkbox"
                  (ionChange)="checkCheckbox()"
                  [value]="pick"
                ></ion-checkbox>
              </div>
            </ion-card-content>
          </ion-card>
        </ng-container>

        <!-- Noche -->
        <ng-container *ngIf="selectedOption === 'noche'">
          <ion-card class="card" *ngFor="let pick of nightCards">
            <ion-card-header>
              <ion-card-title class="card-number">{{ pick }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <div class="card-content">
                <ion-checkbox
                  #checkboxNight
                  class="card-checkbox"
                  (ionChange)="checkCheckbox()"
                  [value]="pick"
                ></ion-checkbox>
              </div>
            </ion-card-content>
          </ion-card>
        </ng-container>
      </ion-list>

      <!-- Botón Flotante de Adicionar Número -->
      <ion-fab
        slot="fixed"
        vertical="bottom"
        horizontal="end"
        (click)="openAddModal()"
      >
        <ion-fab-button>
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <!-- Botón Flotante de Eliminar Número -->
      <ion-fab
        slot="fixed"
        vertical="bottom"
        horizontal="start"
        *ngIf="this.showTrashButton"
      >
        <ion-fab-button (click)="removeSelectedCards()">
          <ion-icon name="trash"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styleUrls: ['./limit-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
})
export class LimitModalComponent implements OnInit {
  selectedOption: string = 'mediodia';
  showTrashButton: boolean = false;
  dayCards: string[] = [];
  nightCards: string[] = [];
  @ViewChildren('checkboxDay') checkBoxesDay!:IonCheckbox[]
  @ViewChildren('checkboxNight') checkBoxesNight!:IonCheckbox[]

  constructor(
    private modalCtrl: ModalController,
    private dbService: BolistaDbService
  ) {}

  ngOnInit() {
    this.dbService.mDb.query(`select * from limits`).then((ret) => {
      ret.values?.forEach((limit) => {
        if (limit.grupo === 1) {
          this.dayCards.push(limit.pick);
        } else if (limit.grupo === 2) {
          this.nightCards.push(limit.pick);
        }
      });
    });
  }

  async openAddModal() {
    const modal = await this.modalCtrl.create({
      component: AddModalComponent,
      cssClass: 'add-modal-css',
    });

    modal.onDidDismiss().then((result) => {
      if (result && result.data) {
        
        this.addCard(result.data.number);
      }
    });

    return await modal.present();
  }
  
  addCard(number: string) {
    if (this.selectedOption === 'mediodia') {
      this.dbService.mDb.execute(
        `insert into limits (pick,grupo) values (${number},1)`
      );
    } else if (this.selectedOption === 'noche') {
      this.dbService.mDb.execute(
        `insert into limits (pick,grupo) values (${number},2)`
        );
    }
    
    this.refreshCards()
  }

  checkCheckbox() {
    let checked=false
    if (this.selectedOption==='mediodia') {
      for (const cbox of this.checkBoxesDay) {
        if(cbox.checked){
          checked=true;
          break;
        }
      }
      
    } else if(this.selectedOption==='noche') {
      
      for (const cbox of this.checkBoxesNight) {
        if(cbox.checked){
          checked=true;
          break;
        }
      }
    }
    if(checked) {this.showTrashButton=true}
    else {this.showTrashButton=false}
  }

  removeSelectedCards() {
    if (this.selectedOption==='mediodia') {
      for (const cbox of this.checkBoxesDay) {
        if(cbox.checked){
          this.dbService.mDb.execute(`delete from limits where pick=${cbox.value} and grupo=1`)
          
        }
      }
      
    } else if(this.selectedOption==='noche') {
      
      for (const cbox of this.checkBoxesNight) {
        if(cbox.checked){
          this.dbService.mDb.execute(`delete from limits where pick=${cbox.value} and grupo=2`)
          
        }
      }
    }
    this.refreshCards()
  }

  refreshCards() {
    this.dbService.mDb.query(`select * from limits`).then((ret) => {
      let newList:string[]=[]
      let newList2:string[]=[]
      ret.values?.forEach((limit) => {
        if (limit.grupo === 1) {
          newList.push(limit.pick);
        } else if (limit.grupo === 2) {
          newList2.push(limit.pick);
        }
      });
      this.dayCards=newList
      this.nightCards=newList2
    });
    this.showTrashButton=false
  }
  changeCards(){
    this.showTrashButton=false
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
}
