import { Component, OnInit, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { PorcentModalComponent } from '../porcent-modal/porcent-modal.component';
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
              <div
                [routerLink]="['contactos']"
                [queryParams]="{ group }"
                class="cash-button"
                detail="false"
                routerLinkActive="selected"
              >
                $ {{ total.totalPases | number : '1.2-2' }}
              </div>
              <div class="cash">$ {{ percentPases | number : '1.2-2' }}</div>
            </div>
            <ion-button
              fill="clear"
              id="pasePorcent"
              (click)="openPorcentModal('pasePorcent')"
              >{{ selectedPercentPase }} %</ion-button
            >

            <div class="divider"></div>

            <div class="list-title">Lista</div>
            <div class="list-section">
              <div
                [routerLink]="['contactos']"
                [queryParams]="{ group }"
                class="cash-button"
                detail="false"
                routerLinkActive="selected"
              >
                $ {{ total.totalMoney | number : '1.2-2' }}
              </div>
              <div class="cash">$ {{ percentMoney | number : '1.2-2' }}</div>
            </div>

            <div class="card-end">
              <ion-button
                fill="clear"
                id="listPorcent"
                (click)="openPorcentModal('listPorcent')"
                >{{ selectedPercentMoney }} %</ion-button
              >
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
    PorcentModalComponent,
    DecimalPipe,
    NgIf,
    AsyncPipe,
  ],
})
export class DayCardComponent implements OnInit {
  dbService = inject(BolistaDbService);
  listCardService = inject(ListCardService);
  modalCtrl = inject(ModalController);

  @Input() group!: number;

  total$!: Observable<ListTotal>;
  totalMoney: number = 0;
  totalPases: number = 0;
  percentMoney: number = 0;
  percentPases: number = 0;
  selectedPercentMoney: number = 0;
  selectedPercentPase: number = 0;

  ngOnInit() {
    this.total$ = this.listCardService.listDayTotal$.pipe(
      tap((total) => {
        this.totalMoney = total.totalMoney;
        this.totalPases = total.totalPases;
      })
    );
  }
  async openPorcentModal(modalId: string) {
    const modal = await this.modalCtrl.create({
      component: PorcentModalComponent,
      cssClass: 'porcentModal',
      id: modalId,
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      if (modalId === 'listPorcent') {
        this.selectedPercentMoney = data;
        this.calculatePercentMoney(data);
      } else if (modalId === 'pasePorcent') {
        this.selectedPercentPase = data;
        this.calculatePercentPase(data);
      }
    }
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
        this.resetCard();
      })
      .catch((err) => console.log(err));
  }

  resetCard() {
    this.listCardService.updateListDayTotal(0);
    this.percentMoney = 0;
    this.percentPases = 0;
    this.selectedPercentMoney = 0;
    this.selectedPercentPase = 0;
  }
}
