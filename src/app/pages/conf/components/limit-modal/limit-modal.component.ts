import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
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
            (ionChange)="filterCards()"
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
                  (ionChange)="checkCheckbox($event)"
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
                  (ionChange)="checkCheckbox($event)"
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
        *ngIf="
          selectedOption === 'mediodia'
            ? showTrashButtonDay
            : showTrashButtonNight
        "
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
  showTrashButtonDay: boolean = false;
  showTrashButtonNight: boolean = false;
  dayCards: string[] = [];
  nightCards: string[] = [];

  constructor(
    private modalCtrl: ModalController,
    private dbService: BolistaDbService
  ) {}

  ngOnInit() {
    this.dbService.mDb.query(`select all from limits`).then((ret) => {
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
        if (this.selectedOption === 'mediodia') {
          this.dbService.mDb.execute(
            `insert into limits (pick,grupo) values (${result.data.number},1)`
          );
        } else if (this.selectedOption === 'noche') {
          this.dbService.mDb.execute(
            `insert into limits (pick,grupo) values (${result.data.number},2)`
          );
        }
        this.addCard(result.data.number, this.selectedOption);
      }
    });

    return await modal.present();
  }

  addCard(number: string, tiro: string) {
    const newCard = { number: number, isChecked: false, tiro: tiro };

    if (tiro === 'mediodia') {
      // this.dayCards.push(newCard);
    } else if (tiro === 'noche') {
      // this.nightCards.push(newCard);
    }

    this.filterCards();
  }

  checkCheckbox(event: any) {
    /* this.showTrashButtonDay = this.dayCards.some((card) => );
    this.showTrashButtonNight = this.nightCards.some((card) => card.isChecked); */
    console.log(event.target.checked);
  }

  removeSelectedCards() {
    // this.dayCards = this.dayCards.filter((card) => !card.isChecked);
    // this.nightCards = this.nightCards.filter((card) => !card.isChecked);
    this.filterCards();
    this.showTrashButtonDay = false;
    this.showTrashButtonNight = false;
  }

  filterCards() {
    if (this.selectedOption === 'mediodia') {
      this.showTrashButtonDay = this.showTrashButtonDay;
    } else if (this.selectedOption === 'noche') {
      this.showTrashButtonNight = this.showTrashButtonNight;
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
}
