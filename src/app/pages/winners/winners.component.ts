import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HoraPipe } from 'src/app/pipes/hora.pipe';
import { HoraService } from 'src/app/services/hora.service';

@Component({
  selector: 'app-winners',
  templateUrl: './winners.component.html',
  styleUrls: ['./winners.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HoraPipe]
})
export class WinnersComponent  implements OnInit {
  horaActual!: string;
  tiro!: string;
  pick3!: string;
  constructor(private horaService: HoraService) { }

  ngOnInit() { this.horaService.obtenerHoraActual().subscribe(
    hora => this.horaActual = hora
  );}
}
