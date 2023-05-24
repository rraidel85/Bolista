import { Component, Injectable, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PayModalComponent } from './components/pay-modal/pay-modal.component';

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


  constructor(private modalCtrl: ModalController) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: light)');
    this.darkMode = prefersDark.matches;
   }


   cambio(){
    //const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark');
   }

   async openModal() {
    const modal = await this.modalCtrl.create({
      component: PayModalComponent,
    });
    modal.present();

  }

  ngOnInit() {}


}
