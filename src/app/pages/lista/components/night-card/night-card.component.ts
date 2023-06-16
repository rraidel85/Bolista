import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PorcentModalComponent } from '../porcent-modal/porcent-modal.component';

@Component({
  selector: 'app-night-card',
  template: `
    <ion-item id="list-card">
  <ion-label>
    <ion-grid>
      <div class="card-top">
        <div id="icon-background">
         <ion-icon id="moon-icon" name="moon"></ion-icon>
        </div>        
         <ion-icon id="trash-icon" name="trash"></ion-icon>
      </div>
      
      <div class="pase-title">Pase</div>
      <div class="pase-section">
        <div class="cash-button">$ 0.00</div>
        <div class="cash">$ 0.00</div>
      </div>
      <ion-button fill="clear" id="pasePorcent2" (click)="openPorcentModal('pasePorcent2')">0 %</ion-button>

<div class="divider"></div>

      <div class="list-title">Lista</div>
      <div class="list-section">
      <div class="cash-button" [routerLink]="['contactos']" detail="false" routerLinkActive="selected">$ 0.00</div>
        <div class="cash">$ 0.00</div>
      </div>

      <div class="card-end">

      <ion-button fill="clear" id="listPorcent2" (click)="openPorcentModal('listPorcent2')">0 %</ion-button>
        <div class="detail-button" [routerLink]="['detalles']" detail="false" routerLinkActive="selected">Detalles</div>

      </div>
    </ion-grid>
  </ion-label>
</ion-item>
  `,
  styleUrls: ['./night-card.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink,FormsModule,PorcentModalComponent],
})
export class NightCardComponent implements OnInit {
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  async openPorcentModal(modalId: string) {
    const modal = await this.modalCtrl.create({
      component: PorcentModalComponent,
      cssClass: 'porcentModal',
      id: modalId 
    });
    modal.present();
  }
}
