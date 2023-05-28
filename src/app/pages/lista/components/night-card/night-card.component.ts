import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-night-card',
    templateUrl: './night-card.component.html',
    styleUrls: ['./night-card.component.scss'],
    standalone: true,
    imports: [IonicModule, RouterLink],
})
export class NightCardComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
