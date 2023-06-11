import { Component, OnInit } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { PayModalComponent } from './components/pay-modal/pay-modal.component';
import { LimitModalComponent } from './components/limit-modal/limit-modal.component';
import { HoraService } from 'src/app/services/hora.service';
import { HoraPipe } from 'src/app/pipes/hora.pipe';
import { BolistaDbService } from 'src/app/services/bolista-db.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-conf',
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Configuración</ion-title>
        <ion-text class="hour" slot="end">{{ horaActual | hora }}</ion-text>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-list>
        <ion-item class="list-option">
          <ion-icon slot="start" name="moon"></ion-icon>
          <ion-label>Activar Modo Oscuro</ion-label>
          <ion-toggle
            slot="end"
            [checked]="darkMode"
            (ionChange)="cambio()"
          ></ion-toggle>
        </ion-item>
        <ion-item class="list-option" (click)="openLimitModal()">
          <ion-icon
            slot="start"
            ios="stopwatch-outline"
            md="stopwatch-sharp"
          ></ion-icon>
          <ion-label>Limitados</ion-label>
        </ion-item>

        <ion-item class="list-option" expand="block" (click)="openPayModal()">
          <ion-icon slot="start" ios="cash-outline" md="cash-sharp"></ion-icon>
          <ion-label>Pagos</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styleUrls: ['./conf.component.scss'],
  standalone: true,
  imports: [IonicModule, HoraPipe, FormsModule],
})
export class ConfComponent implements OnInit {
  public darkMode: boolean = false;
  horaActual!: string;

  constructor(
    private modalCtrl: ModalController,
    private horaService: HoraService,
    private dbService: BolistaDbService
  ) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: light)');
    this.darkMode = prefersDark.matches;
  }

  cambio() {
    //const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.darkMode = !this.darkMode;
    const tema = this.darkMode ? 'dark' : 'light';
    this.dbService.mDb
      .execute(`update config set tema='${tema}'`)
      .then((ret) => {
        document.body.classList.toggle('dark');
      });
  }

  async openPayModal() {
    const modal = await this.modalCtrl.create({
      component: PayModalComponent,
    });
    modal.present();
  }

  async openLimitModal() {
    const modal = await this.modalCtrl.create({
      component: LimitModalComponent,
    });
    modal.present();
  }

  ngOnInit() {
    this.horaService
      .obtenerHoraActual()
      .subscribe((hora) => (this.horaActual = hora));
    this.dbService.mDb.query(`select tema from config`).then((ret) => {
      const tema = ret.values![0].tema;
      if (tema === 'dark') {
        this.darkMode = true;
        document.body.classList.add('dark');
      } else {
        this.darkMode = false;
        document.body.classList.remove('dark');
      }
    });
  }
}
