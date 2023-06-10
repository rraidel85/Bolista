import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { AddModalComponent } from '../add-modal/add-modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-limit-modal',
  template:` 
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
      <ion-select (ngModel)="tiro" interface="popover">
        <ion-select-option value="mediodia">Mediodía</ion-select-option>
        <ion-select-option value="noche">Noche</ion-select-option>
      </ion-select>
    </ion-item>

    
   
  <ion-card class="card"  *ngFor="let card of cards">
  <ion-card-header>
    <ion-card-title class="card-number">{{card.number}}</ion-card-title>
  </ion-card-header>
  <ion-card-content>
    <div class="card-content">
    <ion-checkbox class="card-checkbox" [(ngModel)]="card.isChecked" (ionChange)="checkCheckbox()"></ion-checkbox>
    </div>
  </ion-card-content>
  </ion-card>
  </ion-list>

<!-- Botón Flotante de Adicionar Número -->
  <ion-fab slot="fixed" vertical="bottom" horizontal="end" (click)="openAddModal()">
  <ion-fab-button>
    <ion-icon name="add"></ion-icon>
  </ion-fab-button>
</ion-fab>

<!-- Botón Flotante de Eliminar Número -->
<ion-fab slot="fixed" vertical="bottom" horizontal="start" *ngIf="showTrashButton">
  <ion-fab-button>
    <ion-icon name="trash"></ion-icon>
  </ion-fab-button>
</ion-fab>


</ion-content>
`,
  styleUrls: ['./limit-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule,FormsModule]
})
export class LimitModalComponent implements OnInit {
  tiro!: string;
  cards: { number: number; isChecked: boolean }[] = [];
  showTrashButton: boolean = false;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  async openAddModal() {
    const modal = await this.modalCtrl.create({
      component: AddModalComponent,
      cssClass: 'add-modal-css'
    });

    modal.onDidDismiss().then((result) => {
      if (result && result.data) {
        this.addCard(result.data.number);
        this.checkCheckbox();
      }
    });

    return await modal.present();
  }

  addCard(number: number) {
    this.cards.push({ number: number, isChecked: false });
    this.checkCheckbox(); // Verificar los checkboxes al agregar una tarjeta
  }

  checkCheckbox() {
    const checkedCards = this.cards.filter((card) => card.isChecked);
    this.showTrashButton = checkedCards.length > 0;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
}
