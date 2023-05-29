import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

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

          <div class="card-mid" routerLink="">
            <div class="cash-button">$ 0.00</div>
            <div class="cash">$ 0.00</div>
          </div>

          <div class="card-end" routerLink="">
            <ion-col size="1.6">
              <div class="porcent-button">0 %</div>
            </ion-col>
            <ion-col size="1.6" style="margin-left: -50px;">
              <div class="detail-button">Detalles</div>
            </ion-col>
          </div>
        </ion-grid>
      </ion-label>
    </ion-item>
  `,
  styleUrls: ['./night-card.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink],
})
export class NightCardComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
