import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-modal',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Información</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-text>{{ message }}</ion-text>
      <div class="modal-buttons">
        <ion-button fill="clear" color="success" (click)="closeModal()"
          >Guardar</ion-button
        >
      </div>
    </ion-content>
  `,
  styleUrls: ['./info-modal.component.scss'],
})
export class InfoModalComponent {
  @Input('message') message!: string;

  constructor(private modalCtrl: ModalController) {}

  closeModal() {
    return this.modalCtrl.dismiss();
  }
}
