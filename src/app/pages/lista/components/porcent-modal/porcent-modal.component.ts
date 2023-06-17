import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-porcent-modal',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  template: `
   <ion-header>
    <ion-toolbar>
      <ion-title>Introduzca el %:</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-item>
      <!-- <ion-label></ion-label> -->
      <ion-input
              type="number"
              min="0"
              max="100"
              inputmode="numeric"
              placeholder="Ingrese el %"
              #percentInput
            ></ion-input>
    </ion-item>
   <div class="modal-buttons">
    <ion-button fill="clear" color="danger" (click)="cancel()">Cancelar</ion-button>
    <ion-button fill="clear" color="success" (click)="confirm(percentInput.value)">Aceptar</ion-button>
  </div>
  </ion-content>
  `,
  styleUrls: ['./porcent-modal.component.scss']
})
export class PorcentModalComponent {
  @Input() buttonId!: string;
  selectedPercent: number = 0;

  constructor(private modalController: ModalController) {}

  async closeModal() {
    await this.modalController.dismiss(null, 'cancel');
  }

  async saveNumber(percent: any) {
    if (percent) {
      this.selectedPercent = percent;  
    } else {
      this.selectedPercent = 0;
    }
   await this.modalController.dismiss({selectedPercent: this.selectedPercent}, 'ok');
  }

  cancel() {
    return this.modalController.dismiss(null, 'cancel');
  }

  confirm(percent: any) {
    if(percent){
      this.selectedPercent = percent;
    }else{
      this.selectedPercent = 0;
    }
    return this.modalController.dismiss(this.selectedPercent, 'confirm');
  }
}
