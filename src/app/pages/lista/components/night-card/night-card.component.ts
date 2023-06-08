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
      
      <div class="pase-title">Pase</div>
      <div class="pase-section" routerLink="">
        <div class="cash-button">$ 0.00</div>
        <div class="cash">$ 0.00</div>
      </div>
      <div class="pase-porcent">0 %</div>

<div class="divider"></div>

      <div class="list-title">Lista</div>
      <div class="list-section" routerLink="">
        <div class="cash-button">$ 0.00</div>
        <div class="cash">$ 0.00</div>
      </div>

      <div class="card-end" routerLink="">

        <div class="porcent-button">0 %</div>
        <div class="detail-button">Detalles</div>

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
