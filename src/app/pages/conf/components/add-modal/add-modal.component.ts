import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { LimitModalComponent } from '../limit-modal/limit-modal.component';

@Component({
  selector: 'app-add-modal',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
   
  <ion-header>
    <ion-toolbar>
      <ion-title>Adicionar</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-item>
      <ion-label>No.</ion-label>
      <ion-input type="number"></ion-input>
    </ion-item>
   <div class="modal-buttons">
    <ion-button fill="clear" color="danger" (click)="closeModal()">Cancelar</ion-button>
    <ion-button fill="clear" color="success" (click)="saveNumber()">Guardar</ion-button>
  </div>
  </ion-content>

  `,
  styleUrls: ['./add-modal.component.scss']
})
export class AddModalComponent {

  number!: number;
  
  constructor(private modalCtrl: ModalController){}

  closeModal() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  saveNumber(){
    const modal = this.modalCtrl.getTop();
    if (modal) {
      const limitModal: LimitModalComponent = modal.data;
      limitModal.addCard(this.number);
    }
    this.closeModal(); 

  }
}
