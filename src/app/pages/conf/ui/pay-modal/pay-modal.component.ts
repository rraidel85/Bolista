import { Component} from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-pay-modal',
    templateUrl: './pay-modal.component.html',
    styleUrls: ['./pay-modal.component.scss'],
    standalone: true,
    imports: [IonicModule],
})
export class PayModalComponent{
  
  pick3!:string;
  pick4!:string;
  limitado!:string;
  centena!:string;
  parle!:string;
  candado!:string;
  centenaCorrida!:string;
 

  constructor(private modalCtrl: ModalController) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  save() {
    const data = [this.pick3, this.pick4, this.limitado, this.centena, this.parle, this.candado, this.centenaCorrida];
    return this.modalCtrl.dismiss(data, 'confirm');
  }
}
