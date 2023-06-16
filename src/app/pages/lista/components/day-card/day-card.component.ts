import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController} from '@ionic/angular';
import { PorcentModalComponent } from '../porcent-modal/porcent-modal.component';

@Component({
  selector: 'app-day-card',
  template: `
    <ion-item id="list-card">
      <ion-label>
        <ion-grid>
          <div class="card-top">
            <ion-icon id="day-icon" name="sunny"></ion-icon>
            <ion-icon id="trash-icon" name="trash"></ion-icon>
          </div>

          <div class="pase-title">Pase</div>
          <div class="pase-section">
            <div class="cash-button">$ 0.00</div>
            <div class="cash">$ 0.00</div>
          </div>
          <ion-button fill="clear" id="pasePorcent" (click)="openPorcentModal('pasePorcent')">0 %</ion-button>

          <div class="divider"></div>

          <div class="list-title">Lista</div>
          <div class="list-section" routerLink="">
            <div
              class="cash-button"
              [routerLink]="['contactos']"
              detail="false"
              routerLinkActive="selected"
            >
              $ 0.00
            </div>
            <div class="cash">$ 0.00</div>
          </div>

          <div class="card-end">
          
          <ion-button fill="clear" id="listPorcent" (click)="openPorcentModal('listPorcent')">0 %</ion-button>
            <div
              class="detail-button"
              [routerLink]="['detalles']"
              detail="false"
              routerLinkActive="selected"
            >
              Detalles
            </div>
          </div>
        </ion-grid>
      </ion-label>
    </ion-item>
  `,
  styleUrls: ['./day-card.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, FormsModule, PorcentModalComponent],
})
export class DayCardComponent implements OnInit {

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

