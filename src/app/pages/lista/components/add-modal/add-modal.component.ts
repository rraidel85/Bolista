import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonInput, IonicModule, ModalController } from '@ionic/angular';
import { DetailOptionComponent } from '../detail-option/detail-option.component';

@Component({
  selector: 'app-add-modal',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Pase</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item>
        <ion-label>No.</ion-label>
        <ion-input type="number" #pase></ion-input>
      </ion-item>
      <div class="modal-buttons">
        <ion-button fill="clear" color="danger" (click)="closeModal()"
          >Cancelar</ion-button
        >
        <ion-button fill="clear" color="success" (click)="saveNumber()"
          >Guardar</ion-button
        >
      </div>
    </ion-content>
  `,
  styleUrls: ['./add-modal.component.scss'],
})
export class AddModalComponent {
  @ViewChild('pase') pase!: IonInput;

  constructor(private modalCtrl: ModalController) {}

  closeModal() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async saveNumber() {
    return this.modalCtrl.dismiss({ value: Number(this.pase.value) });
  }
}
