import { Component } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-pay-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="cancel()">Cerrar</ion-button>
        </ion-buttons>
        <ion-title class="ion-text-center">Pagos</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="save()" [strong]="true">Guardar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-label position="stacked">Pick3:</ion-label>
          <ion-input (ngModel)="(pick3)"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Pick4:</ion-label>
          <ion-input (ngModel)="(pick4)"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Limitado:</ion-label>
          <ion-input (ngModel)="(limitado)"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Centena:</ion-label>
          <ion-input (ngModel)="(centena)"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Parle:</ion-label>
          <ion-input (ngModel)="(parle)"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Candado:</ion-label>
          <ion-input (ngModel)="(candado)"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Centena Corrida:</ion-label>
          <ion-input (ngModel)="(centenaCorrida)"></ion-input>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styleUrls: ['./pay-modal.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class PayModalComponent {
  pick3!: string;
  pick4!: string;
  limitado!: string;
  centena!: string;
  parle!: string;
  candado!: string;
  centenaCorrida!: string;

  constructor(private modalCtrl: ModalController) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  save() {
    const data = [
      this.pick3,
      this.pick4,
      this.limitado,
      this.centena,
      this.parle,
      this.candado,
      this.centenaCorrida,
    ];
    return this.modalCtrl.dismiss(data, 'confirm');
  }
}
