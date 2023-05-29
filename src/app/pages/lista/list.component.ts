import { Component, OnInit } from '@angular/core';
import { NightCardComponent } from './ui/night-card/night-card.component';
import { DayCardComponent } from './ui/day-card/day-card.component';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-inicio',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        RouterLink,
        DayCardComponent,
        NightCardComponent,
    ],
})
export class ListComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
