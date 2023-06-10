import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { AddModalComponent } from '../add-modal/add-modal.component';
import { FormsModule } from '@angular/forms';

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
          <ion-card class="card" *ngFor="let card of dayCards">
            <ion-card-header>
              <ion-card-title class="card-number">{{
                card.number
              }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <div class="card-content">
                <ion-checkbox
                  class="card-checkbox"
                  [(ngModel)]="card.isChecked"
                  (ionChange)="checkCheckbox()"
                ></ion-checkbox>
              </div>
            </ion-card-content>
          </ion-card>
        </ng-container>

        <!-- Noche -->
        <ng-container *ngIf="selectedOption === 'noche'">
          <ion-card class="card" *ngFor="let card of nightCards">
            <ion-card-header>
              <ion-card-title class="card-number">{{
                card.number
              }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <div class="card-content">
                <ion-checkbox
                  class="card-checkbox"
                  [(ngModel)]="card.isChecked"
                  (ionChange)="checkCheckbox()"
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
        *ngIf="showTrashButton"
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
  cards: { number: number; isChecked: boolean; tiro: string }[] = [];
  dayCards: { number: number; isChecked: boolean; tiro: string }[] = [];
  nightCards: { number: number; isChecked: boolean; tiro: string }[] = [];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  async openAddModal() {
    const modal = await this.modalCtrl.create({
      component: AddModalComponent,
      cssClass: 'add-modal-css',
    });

    modal.onDidDismiss().then((result) => {
      if (result && result.data) {
        this.addCard(result.data.number, this.selectedOption);
      }
    });

    return await modal.present();
  }

  addCard(number: number, tiro: string) {
    const newCard = { number: number, isChecked: false, tiro: tiro };
    this.cards.push(newCard);

    if (tiro === 'mediodia') {
      this.dayCards.push(newCard);
    } else if (tiro === 'noche') {
      this.nightCards.push(newCard);
    }

    this.filterCards();
  }

  checkCheckbox() {
    this.showTrashButton = this.cards.some((card) => card.isChecked);
  }

  removeSelectedCards() {
    this.cards = this.cards.filter((card) => !card.isChecked);
    this.dayCards = this.dayCards.filter((card) => !card.isChecked);
    this.nightCards = this.nightCards.filter((card) => !card.isChecked);
    this.filterCards();
    this.showTrashButton = false;
  }

  filterCards() {
    if (this.selectedOption === 'mediodia') {
      this.showTrashButton = this.dayCards.some((card) => card.isChecked);
    } else if (this.selectedOption === 'noche') {
      this.showTrashButton = this.nightCards.some((card) => card.isChecked);
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  } 
 }