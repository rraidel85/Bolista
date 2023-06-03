import { Component, Injectable, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PayModalComponent } from './components/pay-modal/pay-modal.component';
import { LimitModalComponent } from './components/limit-modal/limit-modal.component';
import { HoraService } from 'src/app/services/hora.service';

@Component({
  selector: 'app-conf',
  templateUrl: './conf.component.html',
  styleUrls: ['./conf.component.scss'],
})

@Injectable({
  providedIn: 'root'
})

export class ConfComponent  implements OnInit {

  public darkMode:boolean = false;
  horaActual!: string;
 
  constructor(private modalCtrl: ModalController, private horaService: HoraService) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: light)');
    this.darkMode = prefersDark.matches;
   }


   cambio(){
    //const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark');
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

  ngOnInit() { this.horaService.obtenerHoraActual().subscribe(
    hora => this.horaActual = hora
  );}


}
