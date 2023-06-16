import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { IonInput, IonicModule } from '@ionic/angular';
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
        <ion-text class="hour" slot="end">{{ horaActual | hora }}</ion-text>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-list>
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label>Tiro:</ion-label>
                <ion-select interface="popover">
                  <ion-select-option value="mediodia"
                    >Mediodía</ion-select-option
                  >
                  <ion-select-option value="noche">Noche</ion-select-option>
                </ion-select>
              </ion-item>
            </ion-col>
          </ion-row>
        </ion-grid>

        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label position="stacked">Pick3:</ion-label>
                <ion-input #pick3 type="text"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
        </ion-grid>

        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label position="stacked">Pick4:</ion-label>
                <ion-input #pick41></ion-input>
              </ion-item>
            </ion-col>

            <ion-col>
              <ion-item>
                <ion-label position="stacked">Pick4:</ion-label>
                <ion-input #pick42></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
        </ion-grid>
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-button (click)="getWinners()">Aceptar</ion-button>
              </ion-item>
            </ion-col>
          </ion-row>
        </ion-grid>

        <ion-grid>
          <ion-row>
            <ion-col>
              <div class="trophy-section">Premios</div>
            </ion-col>
          </ion-row>
        </ion-grid>
        <ion-grid>
          <ion-row *ngFor="let winner of winners">
            <ion-col>
              <div>{{winner.pick}}</div>
            </ion-col>
            <ion-col>
              <div>{{winner.price}}</div>
            </ion-col>
            <ion-col>
              <div>{{winner.pago}}</div>
            </ion-col>
            <ion-col>
              <div>{{winner.aPagar}}</div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-list>


    </ion-content>
  `,
  styleUrls: ['./winners.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HoraPipe],
})
export class WinnersComponent implements OnInit {
  horaActual!: string;
  tiro!: string;
  @ViewChild('pick3') pick3!: IonInput;
  @ViewChild('pick41') pick41!: IonInput;
  @ViewChild('pick42') pick42!: IonInput;
  winners:{pick:string, price:number, pago:number, aPagar:number}[]=[]

  dbService = inject(BolistaDbService);
  constructor(private horaService: HoraService) {}

  ngOnInit() {
    this.horaService
      .obtenerHoraActual()
      .subscribe((hora) => (this.horaActual = hora));
  }

  async getWinners() {
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

    const limits = (await this.dbService.mDb.query(`select pick from limits where grupo=1`)).values

    const list= (await this.dbService.mDb.query(`select * from list_elements`)).values

    const exist:{pick:string, pago:string}[]=[]

    const fijo:string=this.pick3.value!.toString().slice(1)
    this.winners=[]

    list?.forEach(element=>{
      let mayWin={
        pick:element.pick,
        price:element.price,
      }
      // console.log(mayWin);
      if(element.pase !== null){
        // mayWin={...mayWin, }
        mayWin.price+=element.pase
      }
      // console.log(mayWin);
      
      if(element.pick.length===2){
        if(element.pick===fijo){
          
          if(exist.includes({ pick:element.pick, pago:'pick3'})){
            const [found,...rest]=this.winners.filter(x=>x.pick===element.pick&&x.pago===pick3)
            this.winners[this.winners.indexOf(found)].pago+=mayWin.price
            this.winners[this.winners.indexOf(found)].aPagar=this.winners[this.winners.indexOf(found)].pago*pick3
          }else{
            this.winners.push({...mayWin, pago:pick3, aPagar:mayWin.price*pick3})
            exist.push({ pick:element.pick, pago:'pick3'})
          }
        }
        if(element.pick===this.pick41.value ||element.pick===this.pick42.value){          
          if(element.corrido!==null){
            if(exist.includes({ pick:element.pick, pago:'pick4'})){
              const [found,...rest]=this.winners.filter(x=>x.pick===element.pick&&x.pago===pick4)
              this.winners[this.winners.indexOf(found)].pago+=element.corrido
              this.winners[this.winners.indexOf(found)].aPagar=this.winners[this.winners.indexOf(found)].pago*pick4
            }else{
              this.winners.push({...mayWin,price:element.corrido, pago:pick4, aPagar:element.corrido*pick4})
              exist.push({ pick:element.pick, pago:'pick3'})
            }
          }
        }
      } else if(element.pick.length===3){
        if(element.pick===this.pick3){
          
          if(exist.includes(element.pick)){
            const [found,...rest]=this.winners.filter(x=>x.pick===element.pick)
            this.winners[this.winners.indexOf(found)].pago+=mayWin.price
            this.winners[this.winners.indexOf(found)].aPagar=this.winners[this.winners.indexOf(found)].pago*pick3
          }else{
            this.winners.push({...mayWin, pago:pick3, aPagar:mayWin.price*pick3})
            exist.push(element.pick)
          }
        }
      }else if(element.pick.length===7){
        
      }else if(element.pick.length===10){
        
      }
    })
  }
}
