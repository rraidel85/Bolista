import { Component, OnInit, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PorcentPopoverComponent } from '../porcent-popover/porcent-popover.component';
import { BolistaDbService } from 'src/app/services/bolista-db.service';
import { DecimalPipe } from '@angular/common';

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
            <div class="cash-button">$ {{ totalPases | number : '1.2-2' }}</div>
            <div class="cash">$ {{ percentPases | number : '1.2-2' }}</div>
          </div>
          <app-porcent-popover
            [buttonId]="'pase-porcent2'"
          ></app-porcent-popover>

          <div class="divider"></div>

          <div class="list-title">Lista</div>
          <div class="list-section" routerLink="">
            <div
              class="cash-button"
              [routerLink]="['contactos']"
              detail="false"
              routerLinkActive="selected"
            >
              $ {{ totalMoney | number : '1.2-2' }}
            </div>
            <div class="cash">$ {{ percentMoney | number : '1.2-2' }}</div>
          </div>

          <div class="card-end">
            <app-porcent-popover
              (emitPercent)="calculatePercentMoney($event)"
              [buttonId]="'list-porcent2'"
            ></app-porcent-popover>
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
  imports: [
    IonicModule,
    RouterLink,
    FormsModule,
    PorcentPopoverComponent,
    DecimalPipe,
  ],
})
export class DayCardComponent implements OnInit {
  dbService = inject(BolistaDbService);

  @Input() group!: number;

  totalMoney: number = 0;
  totalPases: number = 0;
  percentMoney: number = 0;
  percentPases: number = 0;

  ngOnInit() {
    this.dbService.mDb
      .query(`select * from list_elements WHERE grupo=${this.group}`)
      .then((list_elements) => {
        this.totalMoney = list_elements.values
          ?.map((obj) => obj.price)
          .reduce((accumulator, price) => accumulator + price, 0);

        this.totalPases = list_elements.values
          ?.filter((list_element) => !!list_element.pase)
          .map((obj) => obj.pase)
          .reduce((accumulator, price) => accumulator + price, 0);
      })
      .catch((err) => console.log(err));
  }

  calculatePercentMoney(percent: number) {
    this.percentMoney = (this.totalMoney * percent) / 100;
  }

  calculatePercentPase(percent: number) {
    this.percentPases = (this.totalPases * percent) / 100;
  }
}
