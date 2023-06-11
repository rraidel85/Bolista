import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { LimitModalComponent } from '../limit-modal/limit-modal.component';
import { FormsModule } from '@angular/forms';
import { Toast } from '@capacitor/toast';

@Component({
  selector: 'app-add-modal',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Adicionar</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item>
        <ion-label>No.</ion-label>
        <ion-input [(ngModel)]="number" type="text" inputmode="numeric" pattern="^[0-9]{2,3}$"></ion-input>
      </ion-item>
      <div class="modal-buttons">
        <ion-button fill="clear" color="danger" (click)="closeModal()">Cancelar</ion-button>
        <ion-button fill="clear" color="success" (click)="saveNumber()">Guardar</ion-button>
      </div>
    </ion-content>
  `,
  styleUrls: ['./add-modal.component.scss'],
})
export class AddModalComponent {
  number: string | undefined;
  limitModalComponent: LimitModalComponent | undefined;
  
  constructor(private modalCtrl: ModalController, private navParams: NavParams) {
    this.limitModalComponent = this.navParams.get('limitModalComponent');
  }
  
  closeModal() {
    if (this.limitModalComponent) {
      this.limitModalComponent.checkCheckbox();
    }
    this.modalCtrl.dismiss();
  }

  async saveNumber() {
    if (this.number && +this.number >= 0 && +this.number <= 999) {
      await this.modalCtrl.dismiss({ number: this.number });
    } else {
      await Toast.show({
        text: 'Incorrecto',
        duration: 'short',
        position: 'bottom'
      });
    }
  }
  } 