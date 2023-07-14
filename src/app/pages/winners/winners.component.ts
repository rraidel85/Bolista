import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Toast } from '@capacitor/toast';
import { IonInput, IonSelect, IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { HoraPipe } from 'src/app/pipes/hora.pipe';
import { BolistaDbService } from 'src/app/services/bolista-db.service';
import { HoraService } from 'src/app/services/hora.service';

@Component({
  selector: 'app-winners',
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Ganadores</ion-title>
        <ion-text class="hour" slot="end">{{
          horaActual$ | async | hora
        }}</ion-text>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-list>
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-item lines="inset">
                <ion-label>Limitados:</ion-label>
                <ion-select #limitados interface="popover" value="1">
                  <ion-select-option value="1">Mediodía</ion-select-option>
                  <ion-select-option value="2">Noche</ion-select-option>
                </ion-select>
              </ion-item>
            </ion-col>
          </ion-row>
        </ion-grid>

        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-item lines="inset">
                <ion-label position="stacked">Pick3:</ion-label>
                <ion-input #pick3 type="text" inputmode="numeric"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
        </ion-grid>

        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-item lines="inset">
                <ion-label position="stacked">Pick4:</ion-label>
                <ion-input #pick41 inputmode="numeric"></ion-input>
              </ion-item>
            </ion-col>

            <ion-col>
              <ion-item lines="inset">
                <ion-label position="stacked">Pick4:</ion-label>
                <ion-input #pick42 inputmode="numeric"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
        </ion-grid>

        <div class="center-button">
          <ion-item class="accept-item" lines="none">
            <ion-button
              class="accept-button"
              shape="round"
              size="default"
              (click)="getWinners()"
              >Aceptar</ion-button
            >
          </ion-item>
        </div>

        <ion-grid *ngIf="winners.length > 0">
          <ion-row>
            <ion-col>
              <div class="trophy-section">Premios</div>
            </ion-col>
          </ion-row>
        </ion-grid>
        <ion-grid>
          <ion-row *ngIf="winners.length > 0">
            <ion-col class="column-title">
              <div class="pick-title">Pick</div>
            </ion-col>
            <ion-col class="column-title">
              <div class="price-title">Precio</div>
            </ion-col>
            <ion-col class="column-title">
              <div class="pay-title">Pago</div>
            </ion-col>
            <ion-col class="column-title">
              <div class="apay-title">A Pagar</div>
            </ion-col>
          </ion-row>
          <ion-row *ngFor="let winner of winners">
            <ion-col class="column-title">
              <div>{{ winner.pick }}</div>
            </ion-col>
            <ion-col class="column-title">
              <div>{{ winner.price }}</div>
            </ion-col>
            <ion-col class="column-title">
              <div>{{ winner.pago }}</div>
            </ion-col>
            <ion-col class="column-title">
              <div>{{ winner.aPagar }}</div>
            </ion-col>
          </ion-row>
          <ion-row *ngIf="winners.length > 0">
            <ion-col class="column-title">
              <div class="total-title">Total</div>
            </ion-col>
            <ion-col class="column-title">
              <div>{{ totalAPagar() }}</div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-list>
    </ion-content>
  `,
  styleUrls: ['./winners.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HoraPipe, AsyncPipe],
})
export class WinnersComponent implements OnInit {
  horaActual$!: Observable<string>;
  tiro!: string;
  @ViewChild('pick3') pick3!: IonInput;
  @ViewChild('pick41') pick41!: IonInput;
  @ViewChild('pick42') pick42!: IonInput;
  @ViewChild('limitados') limitados!: IonSelect;
  winners: { pick: string; price: number; pago: number; aPagar: number }[] = [];

  dbService = inject(BolistaDbService);
  constructor(private horaService: HoraService) {}

  ngOnInit() {
    this.horaActual$ = this.horaService.obtenerHoraActual();

    this.dbService.mDb.query(`select * from ganadores`).then((ret) => {
      const { pick3, pick41, pick42 } = ret.values![0];
      console.log(pick3);

      this.pick3.value = pick3 === '0' ? '' : pick3;
      this.pick41.value = pick41 === '0' ? '' : pick41;
      this.pick42.value = pick42 === '0' ? '' : pick42;
    });
    this.winners = [];
    this.dbService.mDb.query(`select * from premios`).then((ret) => {
      ret.values!.forEach(({ pick, price, pago, a_pagar }) => {
        this.winners.push({ pick, price, pago, aPagar: a_pagar });
      });
    });
  }

  async getWinners() {
    this.dbService.mDb.execute(
      `update ganadores set pick3=${this.pick3.value},pick41=${this.pick41.value},pick42=${this.pick42.value}`
    );
    let stmt: string[] = [];
    this.winners.forEach((win) => {
      stmt.push(`(${win.pick},${win.price},${win.pago},${win.aPagar})`);
    });
    this.dbService.mDb.execute(`delete from premios`).then(() => {
      if (stmt.length > 0) {
        this.dbService.mDb.execute(
          `insert into premios (pick,price, pago,a_pagar) values ${stmt.join()}`
        );
      }
    });

    const {
      pick3,
      pick4,
      limitado,
      centena,
      parle,
      candado,
      centena_c,
      ...rest
    } = (await this.dbService.mDb.query(`select * from config`)).values![0];
    const limits = (
      await this.dbService.mDb.query(
        `select pick from limits where grupo=${this.limitados.value}`
      )
    ).values?.map((x) => x.pick);

    const list = (await this.dbService.mDb.query(`select * from list_elements`))
      .values;

    const exist: { pick: string; pago: string }[] = [];

    const fijo: string = this.pick3.value!.toString().slice(1);
    this.winners = [];
    let firstForThird =
      +this.pick3.value!.toString()[2] +
      +this.pick41.value!.toString()[1] +
      +this.pick42.value!.toString()[1];
    let firstForSecond =
      +this.pick3.value!.toString()[1] +
      +this.pick41.value!.toString()[0] +
      +this.pick42.value!.toString()[0];

    if (firstForThird > 9) {
      firstForSecond += +firstForThird.toString()[0];
      firstForSecond = +firstForSecond.toString()[1];
      firstForThird = +firstForThird.toString()[1];
    }else{
      firstForSecond = +firstForSecond.toString()[firstForThird.toString().length-1]
    }
    const centenaCorrida = [
      firstForSecond.toString() + this.pick41.value,
      firstForThird.toString() + this.pick42.value,
    ];
    console.log(centenaCorrida);

    list?.forEach((element) => {
      let mayWin = {
        pick: element.pick,
        price: element.price,
      };
      if (element.pase !== null) {
        mayWin.price += element.pase;
      }

      if (element.pick.length === 2) {
        if (element.pick === fijo) {
          let pago = pick3;
          if (limits!.includes(element.pick)) {
            pago = limitado;
          }
          if (exist.includes({ pick: element.pick, pago: 'pick3' })) {
            const [found, ...rest] = this.winners.filter(
              (x) => x.pick === element.pick && x.pago === pago
            );
            this.winners[this.winners.indexOf(found)].pago += mayWin.price;
            this.winners[this.winners.indexOf(found)].aPagar =
              this.winners[this.winners.indexOf(found)].pago * pago;
          } else {
            this.winners.push({
              ...mayWin,
              pago: pago,
              aPagar: mayWin.price * pago,
            });
            exist.push({ pick: element.pick, pago: 'pick3' });
          }
        }
        if (
          element.pick === this.pick41.value ||
          element.pick === this.pick42.value
        ) {
          if (element.corrido !== null) {
            if (exist.includes({ pick: element.pick, pago: 'pick4' })) {
              const [found, ...rest] = this.winners.filter(
                (x) => x.pick === element.pick && x.pago === pick4
              );
              this.winners[this.winners.indexOf(found)].pago += element.corrido;
              this.winners[this.winners.indexOf(found)].aPagar =
                this.winners[this.winners.indexOf(found)].pago * pick4;
            } else {
              this.winners.push({
                ...mayWin,
                price: element.corrido,
                pago: pick4,
                aPagar: element.corrido * pick4,
              });
              exist.push({ pick: element.pick, pago: 'pick3' });
            }
          }
        }
      } else if (element.pick.length === 3) {
        if (element.pick === this.pick3.value) {
          let pago = centena;
          if (exist.includes({ pick: element.pick, pago: 'centena' })) {
            const [found, ...rest] = this.winners.filter(
              (x) => x.pick === element.pick && x.pago === pago
            );
            this.winners[this.winners.indexOf(found)].pago += mayWin.price;
            this.winners[this.winners.indexOf(found)].aPagar =
              this.winners[this.winners.indexOf(found)].pago * pago;
          } else {
            this.winners.push({
              ...mayWin,
              pago: pago,
              aPagar: mayWin.price * pago,
            });
            exist.push({ pick: element.pick, pago: 'centena' });
          }
        }
        if (centenaCorrida.includes(element.pick)) {
          if (exist.includes({ pick: element.pick, pago: 'centenaC' })) {
            const [found, ...rest] = this.winners.filter(
              (x) => x.pick === element.pick && x.pago === centena_c
            );
            this.winners[this.winners.indexOf(found)].pago += mayWin.price;
            this.winners[this.winners.indexOf(found)].aPagar =
              this.winners[this.winners.indexOf(found)].pago * centena_c;
          } else {
            this.winners.push({
              ...mayWin,
              pago: centena_c,
              aPagar: mayWin.price * centena_c,
            });
            exist.push({ pick: element.pick, pago: 'centenaC' });
          }
        }
      } else if (element.pick.length === 7) {
        const [pick1, pick2] = element.pick.split('con');
        if (
          pick1 === fijo &&
          (pick2 === this.pick41.value || pick2 === this.pick42.value)
        ) {
          if (exist.includes({ pick: element.pick, pago: 'parle' })) {
            const [found, ...rest] = this.winners.filter(
              (x) => x.pick === element.pick && x.pago === parle
            );
            this.winners[this.winners.indexOf(found)].pago += mayWin.price;
            this.winners[this.winners.indexOf(found)].aPagar =
              this.winners[this.winners.indexOf(found)].pago * parle;
          } else {
            this.winners.push({
              ...mayWin,
              pago: parle,
              aPagar: mayWin.price * parle,
            });
            exist.push({ pick: element.pick, pago: 'parle' });
          }
        }
      } else if (element.pick.length === 10) {
        const [pick1, pick2, pick3] = element.pick
          .replace('(', '')
          .replace(')', '')
          .split(',');
        const lock = [fijo, this.pick41.value, this.pick42.value];
        if (
          lock.includes(pick1) &&
          lock.includes(pick2) &&
          lock.includes(pick3)
        ) {
          if (exist.includes({ pick: element.pick, pago: 'candado' })) {
            const [found, ...rest] = this.winners.filter(
              (x) => x.pick === element.pick && x.pago === candado
            );
            this.winners[this.winners.indexOf(found)].pago += mayWin.price;
            this.winners[this.winners.indexOf(found)].aPagar =
              this.winners[this.winners.indexOf(found)].pago * candado;
          } else {
            this.winners.push({
              ...mayWin,
              pago: candado,
              aPagar: mayWin.price * candado,
            });
            exist.push({ pick: element.pick, pago: 'candado' });
          }
        }
      }
    });
    if (this.winners.length === 0) {
      await Toast.show({
        text: `No hubo ganadores`,
        duration: 'long',
      });
    }
  }
  totalAPagar() {
    return this.winners.map((x) => x.aPagar).reduce((a, b) => a + b, 0);
  }
}
