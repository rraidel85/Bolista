import { Component, Input } from '@angular/core';
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
              [(ngModel)]="porcentajeSeleccionado"
              placeholder="Ingrese el %"
            ></ion-input>
    </ion-item>
   <div class="modal-buttons">
    <ion-button fill="clear" color="danger" (click)="closeModal()">Cancelar</ion-button>
    <ion-button fill="clear" color="success" (click)="saveNumber()">Aceptar</ion-button>
  </div>
  </ion-content>
  `,
  styleUrls: ['./porcent-modal.component.scss']
})
export class PorcentModalComponent {
  @Input() buttonId!: string;
  porcentajeSeleccionado: number = 0;

  constructor(private modalController: ModalController) {}

  async closeModal() {
    await this.modalController.dismiss;
  }

  saveNumber() {
    const porcentButton = document.getElementById('porcent-button');
    if (porcentButton) {
      porcentButton.textContent = `${this.porcentajeSeleccionado}%`;
    }
    this.modalController.dismiss();
  }
}
