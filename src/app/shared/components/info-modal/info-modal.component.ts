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
     
        <ion-title> <ion-icon class="warning-icon" name="warning" color="warning"></ion-icon>Información</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="text-content">
      <ion-text class="warning-text">Conéctese a <span class="web">Internet</span> e intente nuevamente</ion-text>
      </div>
      <div class="modal-buttons">
        <ion-button fill="clear" shape="round" color="danger" style="font-weight: bold;" (click)="closeModal()"
          >OK</ion-button
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
