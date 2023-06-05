import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-limit-modal',
  templateUrl: './limit-modal.component.html',
  styleUrls: ['./limit-modal.component.scss'],
})
export class LimitModalComponent  implements OnInit {

  tiro!: string;
  
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }


}
