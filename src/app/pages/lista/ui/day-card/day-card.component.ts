import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-day-card',
    templateUrl: './day-card.component.html',
    styleUrls: ['./day-card.component.scss'],
    standalone: true,
    imports: [IonicModule, RouterLink],
})
export class DayCardComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
