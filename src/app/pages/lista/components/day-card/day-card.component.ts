import { Component, OnInit, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PorcentPopoverComponent } from '../porcent-popover/porcent-popover.component';
import { BolistaDbService } from 'src/app/services/bolista-db.service';
import { AsyncPipe, DecimalPipe, NgIf } from '@angular/common';
import { ListCardService } from '../../services/list-card.service';
import { ListTotal } from '../../interfaces/list-total.interface';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-day-card',
  template: `
    <ion-item id="list-card">
      <ion-label>
        <ion-grid>
          <div class="card-top">
            <ion-icon id="day-icon" name="sunny"></ion-icon>
            <ion-icon
              id="trash-icon"
              name="trash"
              (click)="deleteList()"
            ></ion-icon>
          </div>
          <ng-container *ngIf="total$ | async as total">
            <div class="pase-title">Pase</div>
            <div class="pase-section">
              <div class="cash-button">
                $ {{ total.totalPases | number : '1.2-2' }}
              </div>
              <div class="cash">$ {{ percentPases | number : '1.2-2' }}</div>
            </div>
            <app-porcent-popover
              (emitPercent)="calculatePercentPase($event)"
              [buttonId]="'pase-porcent2'"
            ></app-porcent-popover>

            <div class="divider"></div>

            <div class="list-title">Lista</div>
            <div class="list-section">
              <div
                [routerLink]="['contactos']"
                [queryParams]="{ group }"
                class="cash-button"
                detail="false"
              >
                $ {{ total.totalMoney | number : '1.2-2' }}
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
          </ng-container>
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
    NgIf,
    AsyncPipe,
  ],
})
export class DayCardComponent implements OnInit {
  dbService = inject(BolistaDbService);
  listCardService = inject(ListCardService);

  @Input() group!: number;

  total$!: Observable<ListTotal>;
  totalMoney: number = 0;
  totalPases: number = 0;
  percentMoney: number = 0;
  percentPases: number = 0;

  ngOnInit() {
    // this.listCardService.updateListTotal(this.group);
    this.total$ = this.listCardService.listDayTotal$.pipe(
      tap((total) => {
        this.totalMoney = total.totalMoney;
        this.totalPases = total.totalPases;
      })
    );
  }

  calculatePercentMoney(percent: number) {
    this.percentMoney = (this.totalMoney * percent) / 100;
  }

  calculatePercentPase(percent: number) {
    this.percentPases = (this.totalPases * percent) / 100;
  }

  deleteList() {
    this.dbService.mDb
      .execute(`DELETE FROM list_elements WHERE grupo=${this.group}`)
      .then((_) => {
        this.listCardService.updateListDayTotal(0);
      })
      .catch((err) => console.log(err));
  }
}
