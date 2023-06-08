import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PorcentPopoverComponent } from '../porcent-popover/porcent-popover.component';
import { FormsModule } from '@angular/forms';

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
      <app-porcent-popover [buttonId]="'pase-porcent'"></app-porcent-popover>

<div class="divider"></div>

      <div class="list-title">Lista</div>
      <div class="list-section">
      <div class="cash-button" [routerLink]="['contactos']" detail="false" routerLinkActive="selected">$ 0.00</div>
        <div class="cash">$ 0.00</div>
      </div>

      <div class="card-end">

        <app-porcent-popover [buttonId]="'list-porcent'"></app-porcent-popover>
        <div class="detail-button" [routerLink]="['detalles']" detail="false" routerLinkActive="selected">Detalles</div>

      </div>
    </ion-grid>
  </ion-label>
</ion-item>
  `,
  styleUrls: ['./night-card.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink,FormsModule, PorcentPopoverComponent],
})
export class NightCardComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
