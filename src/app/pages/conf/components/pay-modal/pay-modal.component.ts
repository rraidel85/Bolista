import { Component, OnInit } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { ModalController, IonicModule } from '@ionic/angular';
import { BolistaDbService } from 'src/app/services/bolista-db.service';

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
          <ion-input [(ngModel)]="pick3" inputmode="numeric"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Pick4:</ion-label>
          <ion-input [(ngModel)]="pick4" inputmode="numeric"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Limitado:</ion-label>
          <ion-input [(ngModel)]="limitado" inputmode="numeric"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Centena:</ion-label>
          <ion-input [(ngModel)]="centena" inputmode="numeric"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Parle:</ion-label>
          <ion-input [(ngModel)]="parle" inputmode="numeric"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Candado:</ion-label>
          <ion-input [(ngModel)]="candado" inputmode="numeric"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Centena Corrida:</ion-label>
          <ion-input [(ngModel)]="centenaCorrida" inputmode="numeric"></ion-input>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styleUrls: ['./pay-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class PayModalComponent implements OnInit{
  pick3!: number;
  pick4!: number;
  limitado!: number;
  centena!: number;
  parle!: number;
  candado!: number;
  centenaCorrida!: number;

  constructor(
    private modalCtrl: ModalController,
    private dbService: BolistaDbService
  ) {}

  ngOnInit(): void {
    this.dbService.mDb.query(`select * from config`).then(ret=>{
      let config=ret.values![0]
      this.pick3=config.pick3
      this.pick4=config.pick4
      this.limitado=config.limitado
      this.centena=config.centena
      this.parle=config.parle
      this.candado=config.candado
      this.centenaCorrida=config.centena_c
    })
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  save() {
    
    this.dbService.mDb.execute(
      `update config 
      set pick3=${this.pick3},
      pick4=${this.pick4},
      limitado=${this.limitado},
      centena=${this.centena},
      parle=${this.parle},
      candado=${this.candado},
      centena_c=${this.centenaCorrida}`
    );
    return this.modalCtrl.dismiss('confirm');
  }
}
